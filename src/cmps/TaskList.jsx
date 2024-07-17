import React from 'react'
import TaskPreview from './TaskPreview'

function TaskList({ tasks, members, labels }) {
    return (
        <div className='task-list '>
            {tasks.map(task => (
                <TaskPreview key={task.id} task={task} members={members} labels={labels} />
            ))}
        </div>
    )
}

export default TaskList
