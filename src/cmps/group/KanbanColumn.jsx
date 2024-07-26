import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'

export function KanbanColumn({ status, tasks, index }) {
    // Filter tasks based on the status
    const filteredTasks = tasks.filter(task => task.status === status)

    return (
        <div className='kanban-column'>
            <div className='kanban-column-header'>{status}</div>
            <Droppable droppableId={status} type='TASK'>
                {provided => (
                    <div className='kanban-column-tasks' ref={provided.innerRef} {...provided.droppableProps}>
                        {filteredTasks.map((task, index) => (
                            <TaskCard key={task._id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
