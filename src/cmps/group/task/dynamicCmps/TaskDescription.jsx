import React from 'react'
import { EditableText } from 'monday-ui-react-core'

const TaskDescription = ({ task, onUpdateField }) => (
    <EditableText
        value={task.description || ''}
        onChange={value => onUpdateField(task, 'description', value)}
        placeholder='Add a description'
        title=''
    />
)

export default TaskDescription
