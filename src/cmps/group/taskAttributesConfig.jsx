import React from 'react'
import { Avatar, DatePicker, Dialog, DialogContentContainer, EditableText } from 'monday-ui-react-core'
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
    padding: '5px',
    cursor: 'pointer',
}

const taskAttributesConfig = {
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField) => (
            <EditableText value={task.title} onChange={value => onUpdateField(task, 'title', value)} />
        ),
        className: 'sticky-col task-col',
        width: '200px', // Set the desired width for the column
    },
    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField) => (
            <div
                style={{ ...cellStyle, ...getStatusStyle(task.status) }}
                onClick={() => {
                    const newStatus = prompt(
                        'Enter new status (Done, Working on it, Stuck, Not Started, Important)',
                        task.status || 'Not Started'
                    )
                    if (newStatus) onUpdateField(task, 'status', newStatus)
                }}
            >
                {task.status || 'Not Started'}
            </div>
        ),
        className: 'cell-col status-col',
        width: '120px', // Set the desired width for the column
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField) => (
            <div
                style={{ ...cellStyle, ...getPriorityStyle(task.priority) }}
                onClick={() => {
                    const newPriority = prompt(
                        'Enter new priority (low, medium, high, critical)',
                        task.priority || 'medium'
                    )
                    if (newPriority) onUpdateField(task, 'priority', newPriority)
                }}
            >
                {task.priority || 'Medium'}
            </div>
        ),
        className: 'cell-col priority-col',
        width: '120px',
    },
    dueDate: {
        label: 'Due Date',
        render: (task, members, labels, onUpdateField) => {
            const dueDate = task.dueDate ? moment(task.dueDate) : null
            const formattedDueDate = dueDate ? dueDate.format('YYYY-MM-DD') : 'No Due Date'

            return (
                <div className='monday-storybook-dialog--story-padding'>
                    <Dialog
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
                        <button className='timeline'>{formattedDueDate}</button>
                    </Dialog>
                </div>
            )
        },
        className: 'cell-col due-date-col',
        width: '150px',
    },
    memberIds: {
        label: 'Members',
        render: (task, members, labels, onUpdateField) => {
            return task.memberIds.map(memberId => {
                const member = members.find(member => member._id === memberId)
                const fullName = member ? member.fullname : 'Unknown'
                const nameParts = fullName.split(' ')
                const initials =
                    nameParts.length >= 2
                        ? `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`
                        : fullName.charAt(0).toUpperCase()
                return (
                    <Avatar
                        key={memberId}
                        size={Avatar.sizes.SMALL}
                        type={Avatar.types.TEXT}
                        text={initials}
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
        },
        className: 'cell-col members-col',
        width: '100px',
    },
}

export { taskAttributesConfig, getPriorityStyle, getStatusStyle }
