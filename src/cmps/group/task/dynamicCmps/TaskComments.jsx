import React, { useState } from 'react'
import {
  Dialog,
  DialogContentContainer,
  Button,
  TextArea,
  Avatar,
} from 'monday-ui-react-core'
import {
  AddUpdate,
  Emoji,
  Gif,
  Home,
  Mention,
  Replay,
  ThumbsUp,
} from 'monday-ui-react-core/icons'
import moment from 'moment'
import { ActivityLog } from '../ActiviyLog'
import { MsgIcon } from '../../../svgs/TaskSvg'

export function TaskComments({ task, members, onUpdateField }) {
  const [comments, setComments] = useState(task.comments || [])
  const [newComment, setNewComment] = useState('')

  const [isWriteActive, setIsWriteActive] = useState(false)
  const [isActivityLog, setIsActivityLog] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUpdateTextChange = (e) => {
    setNewComment(e.target.value)
  }

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObject = {
        _id: Date.now().toString(),
        title: newComment,
        createdAt: Date.now(),
        memberId: members[0]?._id,
        fullName: 'Guest',
      }

      const updatedComments = [...comments, newCommentObject]
      setComments(updatedComments)
      setNewComment('')

      onUpdateField(task, 'comments', updatedComments)
    }
  }

  return (
    <div>
      <Dialog
        zIndex={4}
        isOpen={isDialogOpen}
        onDialogDidHide={() => setIsDialogOpen(false)}
        className="custom-dialog"
        title="Build work Plan"
        content={
          <DialogContentContainer>
            <div className="modal-content">
              <div className="update-container">
                <div className="tabs">
                  <h1 className="task-title">{task.title}</h1>
                  <i
                    className="fa-solid fa-xmark close-icon"
                    onClick={() => setIsDialogOpen(false)}
                  ></i>
                  <div className="tab-buttons">
                    <div className="update-icon">
                      <Home />
                      <button
                        onClick={() => setIsActivityLog(false)}
                        className="tab"
                      >
                        Updates
                      </button>
                    </div>
                    <button className="tab">Files</button>
                    <button
                      onClick={() => setIsActivityLog(true)}
                      className="tab"
                    >
                      Activity Log
                    </button>
                  </div>
                </div>
                {isActivityLog && <ActivityLog task={task} />}
                {!task.comments || task.comments.length === 0 ? (
                  <div className="no-update-container">
                    <>
                      <input
                        className="update-input"
                        value={newComment}
                        onChange={handleUpdateTextChange}
                        type="text"
                        placeholder="Add your update here..."
                      ></input>

                      <Button onClick={handleAddComment}>Update</Button>
                    </>

                    <img
                      className={`no-update-img ${
                        isActivityLog ? 'hidden' : ''
                      }`}
                      src="https://cdn.monday.com/images/pulse-page-empty-state.svg"
                      alt="No updates"
                    />
                    <div className={`title ${isActivityLog ? 'hidden' : ''}`}>
                      <h1 className="no-update-header">
                        No updates yet for this item
                      </h1>
                      <p className="no-update-p">
                        Be the first one to update about progress, mention
                        someone or upload files to share with your team members
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {' '}
                    <div
                      className={`comments ${isActivityLog ? 'hidden' : ''}`}
                    >
                      <>
                        <input
                          className="update-input"
                          value={newComment}
                          onChange={handleUpdateTextChange}
                          type="text"
                          placeholder="Add your update here..."
                        ></input>

                        <Button onClick={handleAddComment}>Update</Button>
                      </>

                      <div className="comments-section">
                        {task.comments.map((comment, index) => (
                          <div key={index} className="comment">
                            <Avatar
                              ariaLabel={comment.byMember?.fullname}
                              size={Avatar.sizes.MEDIUM}
                              src={comment.byMember?.imgUrl}
                              type={Avatar.types.IMG}
                              className="custom-avatar"
                              aria-hidden="true"
                            />
                            <div className="comment-body">
                              <div className="comment-header">
                                <span className="comment-author">
                                  {comment.fullName ||
                                    comment.byMember?.fullname}
                                </span>
                                <span className="comment-time">
                                  {moment(comment.createdAt).fromNow()}
                                </span>
                              </div>
                              <p className="comment-text">{comment.title}</p>
                              <div className="comment-actions"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </DialogContentContainer>
        }
        hideTrigger={['clickoutside']}
        position="right-start"
        showTrigger={['click']}
      >
        <div
          className="flex align-center justify-center"
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '0.875em',
            color: '#797A7E',
          }}
          onClick={() => setIsDialogOpen(true)}
        >
          {!task.comments || task.comments.length === 0 ? (
            <AddUpdate size={24} />
          ) : (
            <div
              className="flex align-center justify-center"
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '0.875em',
                color: '#797A7E',
                position: 'relative',
                display: 'inline-block',
              }}
              onClick={() => setIsDialogOpen(true)}
            >
              <MsgIcon size={30} />
              <span className="msg-count">{task.comments.length}</span>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default TaskComments
