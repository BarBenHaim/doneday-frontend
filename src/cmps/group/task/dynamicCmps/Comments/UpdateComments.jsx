import { Avatar, Menu, MenuButton, MenuItem, TextArea } from 'monday-ui-react-core'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { boardService } from '../../../../../services/board'
import { Edit, Delete } from 'monday-ui-react-core/icons'

export function UpdatedComments({ task, boardId, groupId, loggedinUser, onUpdateField }) {
    const [isUpdateBtn, setUpdateBtn] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [updatedComments, setUpdatedComments] = useState(task.comments || [])
    const [editCommentId, setEditCommentId] = useState(null)
    const [editedText, setEditedText] = useState('')

    useEffect(() => {
        setUpdatedComments(task.comments || [])
    }, [task.comments])


    const handleUpdateTextChange = (e) => {
        setUpdateBtn(true)
        setNewComment(e.target.value)
    }

    const handleEditedTextChange = (e) => {
        setEditedText(e.target.value)
    }

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                title: newComment,
                createdAt: Date.now(),
                byMember: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname,
                    imgUrl: loggedinUser.imgUrl,
                },
            }
            console.log('newCommentObject', newCommentObject)
            try {
                const savedComment = await boardService.addComment(boardId, groupId, task._id, newCommentObject)
                console.log('savedComment', savedComment)

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
                title: updatedText,
            })
            const newComments = updatedComments.map((comment) => (comment._id === commentId ? updatedComment : comment))
            setUpdatedComments(newComments)
            onUpdateField(task, 'comments', newComments)
            setEditCommentId(null)
        } catch (err) {
            console.error('Failed to update comment', err)
        }
    }

    const startEditingComment = (commentId, text) => {
        setEditCommentId(commentId)
        setEditedText(text)
    }

    const processedComments = updatedComments.map((comments) => {
        return {
            ...comments,
        }
    })
    return (
        <div className='update-container'>
            <div className='text-area-update'>
                <TextArea
                    aria-label="Write an update..."
                    placeholder="Write an update..."
                    rows={3}
                    className='text-area'
                    value={newComment}
                    onChange={handleUpdateTextChange}
                />
                {isUpdateBtn && (
                    <button className='update-btn' onClick={() => handleAddComment(newComment)}>
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
                            <div className='comment-container'>
                                <li key={comment._id} className='comment-item'>
                                    <Avatar
                                        ariaLabel={comment.byMember.fullname}
                                        size={Avatar.sizes.MEDIUM}
                                        src={comment.byMember.imgUrl}
                                        type={Avatar.types.IMG}
                                        className='custom-avatar'
                                        aria-hidden='true'
                                        tabIndex={2}
                                    />
                                    <div className='comment-body'>
                                        <div className='comment-header'>
                                            <span className='comment-author'>
                                                {comment.byMember.fullname || 'Guest'}
                                            </span>
                                            <span className='comment-time'>{moment(comment.createdAt).fromNow()}</span>
                                            <div className='comment-actions'>
                                                {loggedinUser._id === comment.byMember._id && 
                                                    <MenuButton
                                                        componentPosition='bottom-end'
                                                        dialogPaddingSize='small'
                                                        zIndex={5}>
                                                        <Menu id='menu' size='medium'>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    startEditingComment(comment._id, comment.title)
                                                                }
                                                                icon={Edit}
                                                                title='Edit update'
                                                            />
                                                            <MenuItem
                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                icon={Delete}
                                                                title='Delete update'
                                                            />
                                                        </Menu>
                                                    </MenuButton>

                                                    // <button onClick={() => handleDeleteComment(comment._id)}>
                                                    //     Delete
                                                    // </button>
                                                    // <button
                                                    //     onClick={() => startEditingComment(comment._id, comment.title)}>
                                                    //     Edit
                                                    // </button>
                                               }
                                            </div>
                                        </div>
                                        {editCommentId === comment._id ? (
                                            <TextArea
                                                aria-label='Edit comment'
                                                rows={3}
                                                className='text-area'
                                                value={editedText}
                                                onChange={handleEditedTextChange}
                                            />
                                        ) : (
                                            <p className='comment-text'>{comment.title}</p>
                                        )}
                                        {editCommentId === comment._id && (
                                            <button
                                                className='update-btn'
                                                onClick={() => handleUpdateComment(comment._id, editedText)}>
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
