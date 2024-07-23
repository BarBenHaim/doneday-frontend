import React from 'react'
import { EditableText } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskDatePicker from './dynamicCmps/TaskDatePicker.jsx'
import TaskStatus from './dynamicCmps/TaskStatus.jsx'
import TaskPriority from './dynamicCmps/TaskPriority.jsx'
import TaskMembers from './dynamicCmps/TaskMembers.jsx'
import TaskFiles from './dynamicCmps/TaskFiles.jsx'
import TaskDescription from './dynamicCmps/TaskDescription.jsx'
import TaskComments from './dynamicCmps/TaskComments.jsx'
import TaskChecklists from './dynamicCmps/TaskChecklists.jsx'

const taskAttributesConfig = {
    title: {
        label: 'Task',
        render: (task, members, labels, onUpdateField) => (
            <div className='task-row'>
                <div className='task-row-title'>
                    <EditableText value={task.title} onChange={value => onUpdateField(task, 'title', value)} />
                </div>
                <div className='task-row-comments'>
                    <TaskComments task={task} members={members} onUpdateField={onUpdateField} />
                </div>
            </div>
        ),
        className: 'table-cell sticky-col task-col',
        width: '300px',
    },

    status: {
        label: 'Status',
        render: (task, members, labels, onUpdateField) => <TaskStatus task={task} onUpdateField={onUpdateField} />,
        className: 'table-cell status-col',
        width: '140px',
    },
    priority: {
        label: 'Priority',
        render: (task, members, labels, onUpdateField) => <TaskPriority task={task} onUpdateField={onUpdateField} />,
        className: 'table-cell priority-col',
        width: '140px',
    },
    dueDate: {
        label: 'Timeline',
        render: (task, members, labels, onUpdateField) => <TaskDatePicker task={task} onUpdateField={onUpdateField} />,
        className: 'table-cell due-date-col',
        width: '140px',
    },
    memberIds: {
        label: 'Collaborators',
        render: (task, members, labels, onUpdateField) => (
            <TaskMembers task={task} members={members} onUpdateField={onUpdateField} />
        ),
        className: 'table-cell members-col',
        width: '100px',
    },
    files: {
        label: 'Files',
        render: (task, members, labels, onUpdateField) => <TaskFiles task={task} onUpdateField={onUpdateField} />,
        className: 'table-cell files-col',
        width: '140px',
    },
    description: {
        label: 'Description',
        render: (task, members, labels, onUpdateField) => <TaskDescription task={task} onUpdateField={onUpdateField} />,
        className: 'table-cell description-col',
        width: '300px',
    },
    checklists: {
        label: 'Checklists',
        render: (task, members, labels, onUpdateField) => (
            <TaskChecklists task={task} members={members} onUpdateField={onUpdateField} />
        ),
        className: 'table-cell checklists-col',
        width: '200px',
    },
}

export { taskAttributesConfig }
