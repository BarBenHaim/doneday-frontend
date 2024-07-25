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
  Mention,
  Replay,
  ThumbsUp,
} from 'monday-ui-react-core/icons'
import moment from 'moment'

const cellStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
}

export function TaskComments({ task, members, onUpdateField }) {
  const [comments, setComments] = useState([])
  const [isWriteActive, setIsWtireActive] = useState(false)
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
    <div style={cellStyle}>
      <Dialog
        zIndex={2}
        isOpen={isDialogOpen}
        onDialogDidHide={() => setIsDialogOpen(false)}
        className="custom-dialog"
        title="Build work Plan"
        content={
          <DialogContentContainer>
            <div className="modal-content">
              <div className="tabs">
                <button className="tab ">Updates</button>
                <button className="tab">Files</button>
                <button className="tab">Activity Log</button>
              </div>

              <div className="text-area">
                {!isWriteActive ? (
                  <div>
                    <button
                      className="write-btn"
                      onClick={() => setIsWtireActive(true)}
                    >
                      Write an update...
                    </button>
                  </div>
                ) : (
                  <>
                    <TextArea
                      placeholder="Add your update here..."
                      value={newComment}
                      onChange={handleUpdateTextChange}
                      rows={5}
                      size="500px"
                    />
                    <Button onClick={handleAddComment}>Update</Button>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <div className="icons">
                  {/* <AddFiles /> */}
                  <Gif />
                  <Emoji />
                  <Mention />
                </div>
              </div>

              <div className="comments-section">
                {task.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <Avatar
                      key={comment.byMember._id}
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
                        <Button kind="secondary " className="like-btn">
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
          </DialogContentContainer>
        }
        hideTrigger={['clickoutside']}
        position="bottom"
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
