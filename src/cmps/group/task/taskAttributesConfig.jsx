import React, { useState, useEffect } from 'react'
import {
    Avatar,
    DatePicker,
    Dialog,
    DialogContentContainer,
    EditableText,
    Button,
    Checkbox,
    LinearProgressBar,
    AvatarGroup,
} from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import moment from 'moment'

const getPriorityStyle = value => {
    switch (value) {
        case 'Critical':
            return { backgroundColor: '#563E3E', color: '#F7F7F8' }
        case 'High':
            return { backgroundColor: '#401694', color: '#F7F7F8' }
        case 'Medium':
            return { backgroundColor: '#5559df', color: '#F7F7F8' }
        case 'Low':
            return { backgroundColor: '#579BFC', color: '#F7F7F8' }
        default:
            return { backgroundColor: '#D3D3D3', color: '#F7F7F8' }
    }
}

const getStatusStyle = value => {
    switch (value) {
        case 'Done':
            return { backgroundColor: '#00C875', color: '#F7F7F8' }
        case 'Working on it':
            return { backgroundColor: '#fdab3d', color: '#F7F7F8' }
        case 'Stuck':
            return { backgroundColor: '#DF2F4A', color: '#F7F7F8' }
        case 'Not Started':
            return { backgroundColor: '#C4C4C4', color: '#F7F7F8' }
        case 'Important':
            return { backgroundColor: '#007EB5', color: '#F7F7F8' }
        default:
            return { backgroundColor: '#C4C4C4', color: '#F7F7F8' }
    }
}

const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}

const taskAttributesConfig = {
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField) => (
            <EditableText value={task.title} onChange={value => onUpdateField(task, 'title', value)} />
        ),
        className: 'table-cell sticky-col task-col',
        width: '200px',
    },

    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField) => (
            <div style={cellStyle}>
                <Dialog
                    zIndex={2}
                    content={
                        <DialogContentContainer style={{ width: '150px' }}>
                            <ul className='change-label-container flex align-center '>
                                {['Done', 'Working on it', 'Stuck', 'Not Started', 'Important'].map(status => (
                                    <li
                                        key={status}
                                        style={getStatusStyle(status)}
                                        onClick={() => onUpdateField(task, 'status', status)}
                                    >
                                        {status}
                                    </li>
                                ))}
                            </ul>
                        </DialogContentContainer>
                    }
                    hideTrigger={['clickoutside']}
                    position='bottom'
                    showTrigger={['click']}
                >
                    <div style={{ ...cellStyle, ...getStatusStyle(task.status || 'Not Started'), fontSize: '0.875em' }}>
                        {task.status || 'Not Started'}
                    </div>
                </Dialog>
            </div>
        ),
        className: 'table-cell status-col',
        width: '140px',
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField) => (
            <div style={cellStyle}>
                <Dialog
                    zIndex={2}
                    content={
                        <DialogContentContainer style={{ width: '150px' }}>
                            <ul className='change-label-container flex align-center '>
                                {['Critical', 'High', 'Medium', 'Low'].map(priority => (
                                    <li
                                        key={priority}
                                        style={getPriorityStyle(priority)}
                                        onClick={() => onUpdateField(task, 'priority', priority)}
                                    >
                                        {priority}
                                    </li>
                                ))}
                            </ul>
                        </DialogContentContainer>
                    }
                    hideTrigger={['clickoutside']}
                    position='bottom'
                    showTrigger={['click']}
                >
                    <div style={{ ...cellStyle, ...getPriorityStyle(task.priority || 'Medium'), fontSize: '0.875em' }}>
                        {task.priority || 'Medium'}
                    </div>
                </Dialog>
            </div>
        ),
        className: 'table-cell priority-col',
        width: '140px',
    },
    dueDate: {
        label: 'Date',
        render: (task, members, labels, onUpdateField) => {
            const dueDate = task.dueDate ? moment(task.dueDate) : null
            const formattedDueDate = dueDate ? dueDate.format('YYYY-MM-DD') : 'No Due Date'
            const daysLeft = dueDate ? dueDate.diff(moment(), 'days') : null
            const totalDays = dueDate ? dueDate.diff(moment().subtract(2, 'months'), 'days') : 1
            const progress = daysLeft ? Math.max(((totalDays - daysLeft) / totalDays) * 100, 0) : 0

            return (
                <div className='monday-storybook-dialog--story-padding '>
                    <Dialog
                        zIndex={2}
                        content={
                            <DialogContentContainer>
                                <DatePicker
                                    data-testid='date-picker'
                                    date={dueDate}
                                    onPickDate={value => onUpdateField(task, 'dueDate', value.format('YYYY-MM-DD'))}
                                />
                            </DialogContentContainer>
                        }
                        hideTrigger={['clickoutside']}
                        modifiers={[
                            {
                                name: 'preventOverflow',
                                options: {
                                    mainAxis: false,
                                },
                            },
                        ]}
                        position='bottom'
                        showTrigger={['click']}
                    >
                        <div className='timeline' style={{ position: 'relative' }}>
                            <LinearProgressBar value={progress} />
                            <span style={{ fontSize: '0.875em' }}>{formattedDueDate}</span>
                            {dueDate && (
                                <div
                                    className='hover-info'
                                    style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#fff',
                                        padding: '5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        display: 'none',
                                    }}
                                >
                                    {daysLeft} days left
                                </div>
                            )}
                        </div>
                    </Dialog>
                </div>
            )
        },
        className: 'table-cell due-date-col',
        width: '140px',
    },
    memberIds: {
        label: 'Members',
        render: (task, members, labels, onUpdateField) => {
            const avatars = task.memberIds.map(memberId => {
                const member = members.find(member => member._id === memberId)
                const fullName = member ? member.fullname : 'Unknown'
                const nameParts = fullName.split(' ')
                const initials =
                    nameParts.length >= 2
                        ? `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`
                        : fullName.charAt(0).toUpperCase()

                return member && member.imageUrl ? (
                    <Avatar
                        key={memberId}
                        ariaLabel={fullName}
                        src={member.imageUrl}
                        type='img'
                        size='small'
                        onClick={() => {
                            const newMemberId = prompt('Enter new member ID', memberId)
                            if (newMemberId) {
                                const newMemberIds = task.memberIds.map(id => (id === memberId ? newMemberId : id))
                                onUpdateField(task, 'memberIds', newMemberIds)
                            }
                        }}
                    />
                ) : (
                    <Avatar
                        key={memberId}
                        ariaLabel={fullName}
                        text={initials}
                        type='text'
                        size='small'
                        backgroundColor={Avatar.colors.AQUAMARINE}
                        onClick={() => {
                            const newMemberId = prompt('Enter new member ID', memberId)
                            if (newMemberId) {
                                const newMemberIds = task.memberIds.map(id => (id === memberId ? newMemberId : id))
                                onUpdateField(task, 'memberIds', newMemberIds)
                            }
                        }}
                    />
                )
            })

            return (
                <AvatarGroup max={3} size='small'>
                    {avatars}
                </AvatarGroup>
            )
        },
        className: 'table-cell members-col',
        width: '100px',
    },

    files: {
        label: 'Files',
        render: (task, members, labels, onUpdateField) => {
            const [isDialogOpen, setIsDialogOpen] = useState(false)
            const [fileList, setFileList] = useState(task.files || [])

            const handleFileChange = event => {
                const files = Array.from(event.target.files)
                const updatedFiles = [...fileList, ...files]
                onUpdateField(task, 'files', updatedFiles)
                setFileList(updatedFiles)
                setIsDialogOpen(false)
            }

            const handleFileDelete = index => {
                const updatedFiles = fileList.filter((file, fileIndex) => fileIndex !== index)
                onUpdateField(task, 'files', updatedFiles)
                setFileList(updatedFiles)
            }

            useEffect(() => {
                setFileList(task.files || [])
            }, [task.files])

            return (
                <div style={cellStyle}>
                    <Dialog
                        zIndex={2}
                        isOpen={isDialogOpen}
                        onDialogDidHide={() => setIsDialogOpen(false)}
                        content={
                            <DialogContentContainer>
                                <input
                                    type='file'
                                    multiple
                                    onChange={handleFileChange}
                                    style={{ display: 'block', marginBottom: '10px' }}
                                />
                                <ul>
                                    {fileList.map((file, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {file.name}
                                            <Button
                                                onClick={() => handleFileDelete(index)}
                                                size='small'
                                                kind='secondary'
                                            >
                                                Delete
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </DialogContentContainer>
                        }
                        hideTrigger={['clickoutside']}
                        position='bottom'
                        showTrigger={['click']}
                    >
                        <div style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsDialogOpen(true)}>
                            +
                        </div>
                    </Dialog>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {fileList.slice(0, 2).map((file, index) => (
                            <Avatar
                                key={index}
                                size={Avatar.sizes.SMALL}
                                type={Avatar.types.IMG}
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                            />
                        ))}
                        {fileList.length > 2 && (
                            <Avatar
                                size={Avatar.sizes.SMALL}
                                type={Avatar.types.TEXT}
                                text={`+${fileList.length - 2}`}
                            />
                        )}
                    </div>
                </div>
            )
        },
        className: 'table-cell files-col',
        width: '140px',
    },
    description: {
        label: 'Description',
        render: (task, members, labels, onUpdateField) => (
            <EditableText
                value={task.description || ''}
                onChange={value => onUpdateField(task, 'description', value)}
                placeholder='Add a description'
                title=''
            />
        ),
        className: 'table-cell description-col',
        width: '300px',
    },
    comments: {
        label: 'Comments',
        render: (task, members, labels, onUpdateField) => {
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
        },
        className: 'table-cell comments-col',
        width: '200px',
    },
    checklists: {
        label: 'Checklists',
        render: (task, members, labels, onUpdateField) => {
            const [isDialogOpen, setIsDialogOpen] = useState(false)
            const [newChecklistTitle, setNewChecklistTitle] = useState('')
            const [newChecklistItem, setNewChecklistItem] = useState('')
            const [selectedChecklistId, setSelectedChecklistId] = useState(null)

            const handleAddChecklist = () => {
                const newChecklist = {
                    _id: Date.now().toString(),
                    title: newChecklistTitle,
                    items: [],
                }
                const updatedChecklists = [...task.checklists, newChecklist]
                onUpdateField(task, 'checklists', updatedChecklists)
                setNewChecklistTitle('')
            }

            const handleAddChecklistItem = () => {
                const updatedChecklists = task.checklists.map(checklist => {
                    if (checklist._id === selectedChecklistId) {
                        return {
                            ...checklist,
                            items: [
                                ...checklist.items,
                                { _id: Date.now().toString(), title: newChecklistItem, checked: false },
                            ],
                        }
                    }
                    return checklist
                })
                onUpdateField(task, 'checklists', updatedChecklists)
                setNewChecklistItem('')
            }

            const handleToggleChecklistItem = (checklistId, itemId) => {
                const updatedChecklists = task.checklists.map(checklist => {
                    if (checklist._id === checklistId) {
                        return {
                            ...checklist,
                            items: checklist.items.map(item =>
                                item._id === itemId ? { ...item, checked: !item.checked } : item
                            ),
                        }
                    }
                    return checklist
                })
                onUpdateField(task, 'checklists', updatedChecklists)
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
                                    <EditableText
                                        value={newChecklistTitle}
                                        onChange={value => setNewChecklistTitle(value)}
                                        placeholder='Add a checklist title'
                                    />
                                    <Button onClick={handleAddChecklist}>Add Checklist</Button>
                                    <div>
                                        {task.checklists.map(checklist => (
                                            <div key={checklist._id}>
                                                <h4 onClick={() => setSelectedChecklistId(checklist._id)}>
                                                    {checklist.title}
                                                </h4>
                                                {selectedChecklistId === checklist._id && (
                                                    <div>
                                                        <EditableText
                                                            value={newChecklistItem}
                                                            onChange={value => setNewChecklistItem(value)}
                                                            placeholder='Add a checklist item'
                                                        />
                                                        <Button onClick={handleAddChecklistItem}>Add Item</Button>
                                                        <ul>
                                                            {checklist.items.map(item => (
                                                                <li key={item._id}>
                                                                    <Checkbox
                                                                        checked={item.checked}
                                                                        onChange={() =>
                                                                            handleToggleChecklistItem(
                                                                                checklist._id,
                                                                                item._id
                                                                            )
                                                                        }
                                                                    />
                                                                    {item.title}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                            View/Add Checklists
                        </div>
                    </Dialog>
                </div>
            )
        },
        className: 'table-cell checklists-col',
        width: '200px',
    },
}

export { taskAttributesConfig, getPriorityStyle, getStatusStyle }
