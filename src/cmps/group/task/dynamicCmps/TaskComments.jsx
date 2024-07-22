import React, { useState } from 'react'
import { Dialog, DialogContentContainer, Button } from 'monday-ui-react-core'
import moment from 'moment'

const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}

function TaskComments({ task, members, onUpdateField }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newComment, setNewComment] = useState('')

    const handleAddComment = () => {
        const comment = {
            _id: Date.now().toString(),
            title: newComment,
            createdAt: Date.now(),
            memberId: members[0]?._id,
        }
        const updatedComments = [...task.comments, comment]
        onUpdateField(task, 'comments', updatedComments)
        setNewComment('')
    }

    return (
        <div style={cellStyle}>
            <Dialog
                zIndex={2}
                isOpen={isDialogOpen}
                onDialogDidHide={() => setIsDialogOpen(false)}
                content={
                    <DialogContentContainer>
                        <div>
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder='Add a comment'
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <Button onClick={handleAddComment}>Add Comment</Button>
                            <ul>
                                {task.comments.map(comment => (
                                    <li key={comment._id}>
                                        <p>{comment.title}</p>
                                        <small>{moment(comment.createdAt).fromNow()}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </DialogContentContainer>
                }
                hideTrigger={['clickoutside']}
                position='bottom'
                showTrigger={['click']}
            >
                <div
                    style={{ width: '100%', textAlign: 'center', fontSize: '0.875em' }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    View/Add Comments
                </div>
            </Dialog>
        </div>
    )
}

export default TaskComments
