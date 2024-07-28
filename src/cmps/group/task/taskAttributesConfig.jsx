import React from 'react'
import { Checkbox } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskDatePicker from './dynamicCmps/TaskDatePicker.jsx'
import TaskStatus from './dynamicCmps/TaskStatus.jsx'
import TaskPriority from './dynamicCmps/TaskPriority.jsx'
import TaskMembers from './dynamicCmps/TaskMembers.jsx'
import TaskFiles from './dynamicCmps/TaskFiles.jsx'
import TaskDescription from './dynamicCmps/TaskDescription.jsx'
import TaskChecklists from './dynamicCmps/TaskChecklists.jsx'
import TaskRow from './dynamicCmps/TaskRow.jsx'
import TaskRecording from './dynamicCmps/TaskRecording.jsx'

const taskAttributesConfig = {
    checkbox: {
        label: (
            <span style={{ opacity: '.5' }}>
                <Checkbox disabled />
            </span>
        ),
        render: (task, members, labels, onUpdateField, columnKey, { selectedTasks, handleCheckboxChange }) => (
            <Checkbox checked={selectedTasks.includes(task._id)} onChange={() => handleCheckboxChange(task._id)} />
        ),
        className: 'table-cell checkbox-col',
    },
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskRow
                task={task}
                members={members}
                labels={labels}
                onUpdateField={onUpdateField}
                columnKey={columnKey}
            />
        ),
        className: 'table-cell sticky-col task-col',
    },
    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskStatus task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell status-col',
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskPriority task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell priority-col',
    },
    dueDate: {
        label: 'Timeline',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskDatePicker task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell due-date-col',
    },
    memberIds: {
        label: 'Collaborators',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskMembers task={task} members={members} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell members-col',
    },
    files: {
        label: 'Files',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskFiles task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell files-col',
    },
    description: {
        label: 'Description',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskDescription task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell description-col',
    },
    checklists: {
        label: 'Checklists',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskChecklists task={task} members={members} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell checklists-col',
    },
    recording: {
        label: 'Recording',
        render: (task, members, labels, onUpdateField, columnKey) => (
            <TaskRecording task={task} onUpdateField={onUpdateField} columnKey={columnKey} />
        ),
        className: 'table-cell recording-col',
    },
}

const getResponsiveWidths = () => {
    const width = window.innerWidth

    const baseWidths = {
        checkbox: '50px',
        title: width <= 480 ? '150px' : width <= 768 ? '200px' : '300px',
        status: width <= 480 ? '100px' : width <= 768 ? '100px' : '140px',
        priority: width <= 480 ? '100px' : width <= 768 ? '100px' : '140px',
        dueDate: '140px',
        memberIds: '140px',
        files: width <= 480 ? '80px' : width <= 768 ? '100px' : '140px',
        description: width <= 480 ? '150px' : width <= 768 ? '200px' : '300px',
        checklists: width <= 480 ? '100px' : width <= 768 ? '150px' : '200px',
        recording: width <= 480 ? '100px' : width <= 768 ? '150px' : '200px',
    }

    const allKeys = Object.keys(baseWidths)
    const dynamicWidths = {}

    allKeys.forEach(key => {
        dynamicWidths[key] = baseWidths[key]
        for (let i = 1; i <= 10; i++) {
            dynamicWidths[`${key}${i}`] = baseWidths[key]
        }
    })

    return dynamicWidths
}

export { taskAttributesConfig, getResponsiveWidths }
