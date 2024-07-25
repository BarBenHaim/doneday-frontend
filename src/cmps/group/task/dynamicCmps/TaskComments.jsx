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

export function TaskComments({ task, members, onUpdateField }) {
  const [comments, setComments] = useState([])
  const [isWriteActive, setIsWriteActive] = useState(false)
  const [isActivityLog, setIsActivityLog] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const handleUpdateTextChange = (e) => setNewComment(e.target.value)

  const handleAddComment = () => {
    setComments([
      ...comments,
      {
        _id: Date.now().toString(),
        title: newComment,
        createdAt: Date.now(),
        memberId: members[0]?._id,
      },
    ])

    setNewComment('')
    const updatedComments = [...task.comments, comment]
    onUpdateField(task, 'comments', updatedComments)
  }

  return (
    <div>
      <Dialog
        zIndex={2}
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
                {isActivityLog && (
                  <ActivityLog
                    // // members={members}
                    task={task}
                    // onUpdateField={onUpdateField}
                  />
                )}
                {!task.comments || task.comments.length === 0 ? (
                  <div className="no-update-container">
                    <button
                      className={`write-btn ${isWriteActive ? 'hidden' : ''}`}
                      onClick={() => setIsWriteActive(true)}
                    >
                      Write an update...
                    </button>
                    {isWriteActive && (
                      <>
                        <TextArea
                          className={`custom-textarea ${
                            isActivityLog ? 'hidden' : ''
                          }`}
                          placeholder="Add your update here..."
                          value={newComment}
                          onChange={handleUpdateTextChange}
                          rows={5}
                        />

                        <div
                          className={`modal-footer ${
                            isActivityLog ? 'hidden' : ''
                          }`}
                        >
                          <div className="button-container"></div>
                          <div className="icons">
                            {/* <AddFiles /> */}
                            <Gif />
                            <Emoji />
                            <Mention />
                          </div>
                          <Button onClick={handleAddComment}>Update</Button>
                        </div>
                      </>
                    )}
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
                        <TextArea
                          size="large"
                          aria-label="Add your update here..."
                          value={newComment}
                          onChange={handleUpdateTextChange}
                          rows={5}
                        />

                        <div className="modal-footer">
                          <div className="button-container"></div>
                          <div className="icons">
                            {/* <AddFiles /> */}
                            <Gif />
                            <Emoji />
                            <Mention />
                          </div>
                          <Button onClick={handleAddComment}>Update</Button>
                        </div>
                      </>

                      <div className="comments-section">
                        {task.comments.map((comment, index) => (
                          <div key={index} className="comment">
                            <Avatar
                              ariaLabel={comment.byMember.fullname}
                              size={Avatar.sizes.MEDIUM}
                              src={comment.byMember.imgUrl}
                              type={Avatar.types.IMG}
                              className="custom-avatar"
                              aria-hidden="true"
                            />
                            <div className="comment-body">
                              <div className="comment-header">
                                <span className="comment-author">
                                  {comment.byMember.fullname}
                                </span>
                                <span className="comment-time">
                                  {moment(comment.createdAt).fromNow()}
                                </span>
                              </div>
                              <p className="comment-text">{comment.title}</p>
                              <div className="comment-actions">
                                <Button kind="secondary" className="like-btn">
                                  <ThumbsUp />
                                  Like
                                </Button>

                                <Button kind="secondary" className="reply-btn">
                                  <Replay />
                                  Reply
                                </Button>
                              </div>
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
          <AddUpdate size={24} />
        </div>
      </Dialog>
    </div>
  )
}

export default TaskComments
