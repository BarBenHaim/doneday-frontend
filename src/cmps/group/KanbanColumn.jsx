import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'

export function KanbanColumn({ group, tasks, index }) {
    return (
        <Draggable draggableId={group._id} index={index}>
            {provided => (
                <div className='kanban-column' ref={provided.innerRef} {...provided.draggableProps}>
                    <div className='kanban-column-header' {...provided.dragHandleProps}>
                        {group.title}
                    </div>
                    <Droppable droppableId={group._id} type='TASK'>
                        {provided => (
                            <div className='kanban-column-tasks' ref={provided.innerRef} {...provided.droppableProps}>
                                {tasks.map((task, index) => (
                                    <TaskCard key={task._id} task={task} index={index} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    )
}
