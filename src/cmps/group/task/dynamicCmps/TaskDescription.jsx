import React from 'react'
import { EditableText } from 'monday-ui-react-core'

const TaskDescription = ({ task, onUpdateField, columnKey }) => (
    <EditableText
        value={task[columnKey] || ''}
        onChange={value => onUpdateField(task, columnKey, value)}
        placeholder='Add a description'
        title=''
    />
)

export default TaskDescription
