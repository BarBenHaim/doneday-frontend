import { Avatar, TextArea } from 'monday-ui-react-core'
import { useState, useEffect } from 'react'
import moment from 'moment'

export function UpdatedComments({ task, byMember, onUpdateField }) {
    const [isUpdateBtn, setUpdateBtn] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [updatedComments, setUpdatedComments] = useState(task.comments || [])

    useEffect(() => {
        setUpdatedComments(task.comments || [])
    }, [task.comments])

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
                byMember: byMember || { _id: null, fullName: 'Guest' },
            }

            const newComments = [newCommentObject, ...updatedComments]
            setUpdatedComments(newComments)
            onUpdateField(task, 'comments', newComments)
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
            {updatedComments.length === 0 ? (
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
                        {updatedComments.map(comment => (
                            <li key={comment._id} className='comment-item'>
                                <Avatar
                                    aria-label={comment.byMember.fullName}
                                    size={Avatar.sizes.MEDIUM}
                                    src={comment.byMember?.imgUrl}
                                    type={Avatar.types.IMG}
                                    className='custom-avatar'
                                    aria-hidden='true'
                                />
                                <div className='comment-body'>
                                    <div className='comment-header'>
                                        <span className='comment-author'>{comment.byMember.fullName || 'Guest'}</span>
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
