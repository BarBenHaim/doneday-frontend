import React from 'react'
import TaskList from './TaskList'

function GroupPreview({ group, members, labels }) {
    return (
        <div className='group-preview'>
            <h2>{group.title}</h2>
            <TaskList tasks={group.tasks} members={members} labels={labels} />
        </div>
    )
}

export default GroupPreview
