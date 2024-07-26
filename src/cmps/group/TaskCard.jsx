import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { taskAttributesConfig } from './task/taskAttributesConfig'

export function TaskCard({ task, index, members, labels, onUpdateField, selectedTasks, handleCheckboxChange }) {
    return (
        <Draggable draggableId={task._id} index={index}>
            {provided => (
                <div
                    className='task-card'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className='task-card-header'>
                        <div className='task-card-title'>{task.title}</div>
                    </div>
                    <div className='task-card-attributes'>
                        <div className='labels-container'>
                            {['status', 'priority'].map(columnKey => (
                                <div key={columnKey} className={taskAttributesConfig[columnKey].className}>
                                    {taskAttributesConfig[columnKey].render(
                                        task,
                                        members,
                                        labels,
                                        onUpdateField,
                                        columnKey,
                                        { selectedTasks, handleCheckboxChange }
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='info-container'>
                            {['memberIds'].map(columnKey => (
                                <div key={columnKey} className={taskAttributesConfig[columnKey].className}>
                                    {taskAttributesConfig[columnKey].render(
                                        task,
                                        members,
                                        labels,
                                        onUpdateField,
                                        columnKey,
                                        { selectedTasks, handleCheckboxChange }
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default TaskCard
