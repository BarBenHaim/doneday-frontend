import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

export function TaskCard({ task, index }) {
    return (
        <Draggable draggableId={task._id} index={index}>
            {provided => (
                <div
                    className='task-card'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className='task-card-content'>{task.title}</div>
                </div>
            )}
        </Draggable>
    )
}

export default TaskCard
