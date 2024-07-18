import React from 'react'
import { Avatar, Label, EditableText } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'

const getLabelColor = value => {
    switch (value) {
        case 'high':
            return 'negative'
        case 'medium':
            return 'primary'
        case 'low':
            return 'positive'
        default:
            return 'dark'
    }
}

const taskAttributesConfig = {
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField) => (
            <EditableText value={task.title} onFinishEditing={value => onUpdateField(task, 'title', value)} />
        ),
        className: 'sticky-col task-col',
    },
    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField) => {
            const statusColor = task.status === 'done' ? 'positive' : task.status === 'inProgress' ? 'primary' : 'dark'
            return (
                <Label
                    text={task.status || 'Pending'}
                    color={statusColor}
                    onClick={() => {
                        const newStatus = prompt('Enter new status', task.status || 'Pending')
                        if (newStatus) onUpdateField(task, 'status', newStatus)
                    }}
                />
            )
        },
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField) => (
            <Label
                text={task.priority || 'Medium'}
                color={getLabelColor(task.priority)}
                onClick={() => {
                    const newPriority = prompt('Enter new priority (low, medium, high)', task.priority || 'medium')
                    if (newPriority) onUpdateField(task, 'priority', newPriority)
                }}
            />
        ),
    },
    dueDate: {
        label: 'Due Date',
        render: (task, members, labels, onUpdateField) => (
            <EditableText
                value={task.dueDate || 'No Due Date'}
                onFinishEditing={value => onUpdateField(task, 'dueDate', value)}
            />
        ),
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
    },
}

export { taskAttributesConfig, getLabelColor }
