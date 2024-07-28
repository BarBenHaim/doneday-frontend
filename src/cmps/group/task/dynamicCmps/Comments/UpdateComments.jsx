import { Avatar, TextArea } from 'monday-ui-react-core'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { boardService } from '../../../../../services/board'

export function UpdatedComments({ task, boardId, groupId, loggedinUser, onUpdateField }) {
    const [isUpdateBtn, setUpdateBtn] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [updatedComments, setUpdatedComments] = useState(task.comments || [])

    useEffect(() => {
        setUpdatedComments(task.comments || [])
    }, [task.comments])

    console.log('loggedinUser UpdatedComments', loggedinUser)

    const handleUpdateTextChange = (e) => {
        setUpdateBtn(true)
        setNewComment(e.target.value)
    }

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                // _id: Date.now().toString(),
                txt: newComment,
                createdAt: Date.now(),
                byMember: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname,
                    imgUrl: loggedinUser.imgUrl,
                } || { _id: null, fullname: 'Guest' },
            }

            console.log('newCommentObject UpdatedComments', newCommentObject)

            // const newComments = [newCommentObject, ...updatedComments]
            // setUpdatedComments(newComments)
            // onUpdateField(task, 'comments', newComments)
            // setNewComment('')
            // setUpdateBtn(false)

            try {
                const savedComment = await boardService.addComment(boardId, groupId, task._id, newCommentObject)
                const newComments = [savedComment, ...updatedComments]
                setUpdatedComments(newComments)
                onUpdateField(task, 'comments', newComments)
                setNewComment('')
                setUpdateBtn(false)
            } catch (err) {
                console.error('Failed to add comment', err)
            }
        }
    }
    const handleDeleteComment = async (commentId) => {
        try {
            await boardService.deleteComment(boardId, groupId, task._id, commentId)
            const newComments = updatedComments.filter((comment) => comment._id !== commentId)
            setUpdatedComments(newComments)
            onUpdateField(task, 'comments', newComments)
        } catch (err) {
            console.error('Failed to delete comment', err)
        }
    }

    const handleUpdateComment = async (commentId, updatedText) => {
        try {
            const updatedComment = await boardService.updateComment(boardId, groupId, task._id, commentId, {
                txt: updatedText,
            })
            const newComments = updatedComments.map((comment) => (comment.id === commentId ? updatedComment : comment))
            setUpdatedComments(newComments)
            onUpdateField(task, 'comments', newComments)
        } catch (err) {
            console.error('Failed to update comment', err)
        }
    }

    const processedComments = updatedComments.map((comment) => {
        const byMember = comment.byMember || { fullname: 'Guest', imgUrl: '', _id: null };
        console.log("processedComments byMember", byMember)
        return {
            ...comment,
            byMember,
        };
    });

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
            {processedComments.length === 0 ? (
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
                        {processedComments.map((comment) => (
                            <li key={comment._id} className='comment-item'>
                                <Avatar
                                    aria-label={comment.byMember.fullname}
                                    size={Avatar.sizes.MEDIUM}
                                    src={comment.byMember?.imgUrl}
                                    type={Avatar.types.IMG}
                                    className='custom-avatar'
                                    aria-hidden='true'
                                />
                                <div className='comment-body'>
                                    <div className='comment-header'>
                                        <span className='comment-author'>{comment.byMember.fullname || 'Guest'}</span>
                                        <span className='comment-time'>{moment(comment.createdAt).fromNow()}</span>
                                        {loggedinUser._id === comment.byMember._id && (
                                            <div className='comment-actions'>
                                                <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                                <button onClick={() => handleUpdateComment(comment._id, 'Updated Text')}>
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className='comment-text'>{comment.txt}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
