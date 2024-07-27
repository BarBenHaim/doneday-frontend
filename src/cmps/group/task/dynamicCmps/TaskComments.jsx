import { Avatar, Button, TextArea } from 'monday-ui-react-core'
import { useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'

export function UpdatedComments({ task, members, onUpdateField }) {
    const [isUpdateBtn, setUpdateBtn] = useState(false)
    const [newComment, setNewComment] = useState('')

    const handleUpdateTextChange = e => {
        setUpdateBtn(true)
        setNewComment(e.target.value)
    }

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                _id: Date.now().toString(),
                title: newComment,
                createdAt: Date.now(),
                memberId: members && members.length > 0 ? members[0]._id : null,
                fullName: members && members.length > 0 ? members[0].fullName : 'Guest',
            }

            const updatedComments = [...(task.comments || []), newCommentObject]
            onUpdateField(task, 'comments', updatedComments)
            setNewComment('')
            setUpdateBtn(false)
        }
    }

    return (
        <div className='update-container'>
            <div className='text-area-update'>
                <TextArea
                    aria-label='Write an update...'
                    rows={1}
                    className='text-area'
                    value={newComment}
                    onChange={handleUpdateTextChange}
                />
                {isUpdateBtn && (
                    <button className='update-btn' onClick={handleAddComment}>
                        Update
                    </button>
                )}
            </div>
            {(task.comments || []).length === 0 ? (
                <div className='no-comments'>
                    <img
                        className='no-update-img'
                        src='https://cdn.monday.com/images/pulse-page-empty-state.svg'
                        alt='No updates'
                    />
                    <h1 className='no-update-header'>No updates yet for this item</h1>
                    <p className='no-update-p'>
                        Be the first one to update about progress, mention someone, or upload files to share with your
                        team members
                    </p>
                </div>
            ) : (
                <div className='comments-section'>
                    <ul className='comments-list'>
                        {task.comments.map(comment => (
                            <li key={comment._id} className='comment-item'>
                                <Avatar
                                    aria-label={comment.fullName}
                                    size={Avatar.sizes.MEDIUM}
                                    src={comment.byMember?.imgUrl}
                                    type={Avatar.types.IMG}
                                    className='custom-avatar'
                                    aria-hidden='true'
                                />
                                <div className='comment-body'>
                                    <div className='comment-header'>
                                        <span className='comment-author'>{comment.fullName || 'Guest'}</span>
                                        <span className='comment-time'>{moment(comment.createdAt).fromNow()}</span>
                                    </div>
                                    <p className='comment-text'>{comment.title}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
