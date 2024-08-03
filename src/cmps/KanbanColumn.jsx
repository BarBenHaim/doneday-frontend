import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { getStatusStyle } from './group/task/dynamicCmps/styleUtils'
import TaskCard from './TaskCard'

export function KanbanColumn({
    status,
    tasks,
    index,
    members,
    labels,
    onUpdateField,
    selectedTasks,
    handleCheckboxChange,
}) {
    const filteredTasks = tasks.filter(task => task.status === status)
    return (
        <div className='kanban-column'>
            <div
                className='kanban-column-header'
                style={{
                    backgroundColor: getStatusStyle(status).backgroundColor,
                    color: 'white',
                    padding: '8px',
                    fontSize: '0.875em',
                    fontWeight: '500',
                }}
            >
                {status}
            </div>
            <Droppable droppableId={status} type='TASK'>
                {provided => (
                    <div className='kanban-column-tasks' ref={provided.innerRef} {...provided.droppableProps}>
                        {filteredTasks.map((task, index) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                index={index}
                                members={members}
                                labels={labels}
                                onUpdateField={onUpdateField}
                                selectedTasks={selectedTasks}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
