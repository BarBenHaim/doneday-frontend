import React from 'react'
import { Avatar, Label, Text, EditableText, Dropdown } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'

const getLabelColor = value => {
    switch (value) {
        case 'High':
            return 'negative'
        case 'Medium':
            return 'primary'
        case 'Low':
            return 'positive'
        default:
            return 'dark'
    }
}

const taskAttributesConfig = {
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField) => (
            <EditableText value={task.title} onFinishEditing={value => onUpdateField('title', value)} />
        ),
        className: 'sticky-col task-col',
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
                        backgroundColor={Avatar.colors.LIPSTICK}
                    />
                )
            })
        },
    },
    labelIds: {
        label: 'Labels',
        render: (task, members, labels, onUpdateField) => {
            return task.labelIds.map(labelId => {
                const label = labels.find(label => label._id === labelId)
                return label ? (
                    <Label key={labelId} text={label.title} color={label.color} />
                ) : (
                    <Label key={labelId} text='No Label' color='dark' />
                )
            })
        },
    },
    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField) => {
            const statusColor = task.status === 'Done' ? 'positive' : task.status === 'In Progress' ? 'primary' : 'dark'
            return <Label text={task.status || 'Pending'} color={statusColor} />
        },
    },
    dueDate: {
        label: 'Due Date',
        render: (task, members, labels, onUpdateField) => (
            <EditableText
                value={task.dueDate || 'No Due Date'}
                onFinishEditing={value => onUpdateField('dueDate', value)}
            />
        ),
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField) => (
            <Label text={task.priority || 'Medium'} color={getLabelColor(task.priority)} />
        ),
    },
}

export { taskAttributesConfig, getLabelColor }
