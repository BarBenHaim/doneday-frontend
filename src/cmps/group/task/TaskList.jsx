import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableBody, TableHeaderCell, Button, TableRow, TableCell } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskPreview from './TaskPreview'
import { taskAttributesConfig, getStatusStyle, getPriorityStyle } from './taskAttributesConfig'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service'
import { addTask, updateTask, removeTask, updateGroup } from '../../../store/actions/board.action'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const calculateSummary = taskList => {
    const summary = {
        files: 0,
        status: {},
        priority: {},
    }

    taskList.forEach(task => {
        summary.files += task.files ? task.files.length : 0
        if (task.status) summary.status[task.status] = (summary.status[task.status] || 0) + 1
        if (task.priority) summary.priority[task.priority] = (summary.priority[task.priority] || 0) + 1
    })

    const totalTasks = taskList.length
    for (const key in summary.status) {
        summary.status[key] = (summary.status[key] / totalTasks) * 100
    }
    for (const key in summary.priority) {
        summary.priority[key] = (summary.priority[key] / totalTasks) * 100
    }

    return summary
}

const renderProgressBar = (distribution, colorGetter) => {
    const segments = Object.keys(distribution).map(key => (
        <div
            className='progress-bar'
            key={key}
            style={{
                width: `${distribution[key]}%`,
                backgroundColor: colorGetter(key).backgroundColor,
                height: '100%',
            }}
            title={`${key}: ${distribution[key].toFixed(0)}%`}
        />
    ))

    return <div style={{ display: 'flex', width: '100%', height: '20px' }}>{segments}</div>
}

function TasksList({ tasks, members, labels, board, group, openModal, onUpdateTask, onDeleteTask, isCollapsed }) {
    const [taskList, setTaskList] = useState(tasks)

    useEffect(() => {
        setTaskList(tasks)
    }, [tasks])

    const onDragEnd = async result => {
        const { source, destination } = result

        if (!destination) return
        if (source.droppableId === destination.droppableId && source.index === destination.index) return

        const sourceGroup = board.groups.find(g => g._id === source.droppableId)
        const destinationGroup = board.groups.find(g => g._id === destination.droppableId)

        const sourceTasks = Array.from(sourceGroup.tasks)
        const [movedTask] = sourceTasks.splice(source.index, 1)

        if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, movedTask)
            setTaskList(sourceTasks)

            try {
                const updatedGroup = { ...sourceGroup, tasks: sourceTasks }
                await updateGroup(board._id, sourceGroup._id, updatedGroup)
                showSuccessMsg('Task order updated successfully')
            } catch (err) {
                showErrorMsg('Cannot update task order')
            }
        } else {
            const destinationTasks = Array.from(destinationGroup.tasks)
            destinationTasks.splice(destination.index, 0, movedTask)

            try {
                const updatedSourceGroup = { ...sourceGroup, tasks: sourceTasks }
                await updateGroup(board._id, sourceGroup._id, updatedSourceGroup)

                const updatedDestinationGroup = { ...destinationGroup, tasks: destinationTasks }
                await updateGroup(board._id, destination.droppableId, updatedDestinationGroup)

                showSuccessMsg('Task moved successfully')
            } catch (err) {
                showErrorMsg('Cannot move task')
            }
        }
    }

    const onAddTask = async () => {
        const newTask = {
            _id: `t${Date.now()}`,
            title: 'New Task',
            memberIds: [],
            labelIds: [],
            status: 'Not Started',
            dueDate: null,
            priority: 'Medium',
            comments: [],
            files: [],
        }
        try {
            const addedTask = await addTask(board._id, group._id, newTask)
            setTaskList([addedTask, ...taskList])
            showSuccessMsg('Task added successfully')
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }

    async function onUpdateTask(updatedTask) {
        try {
            await updateTask(board._id, group._id, updatedTask._id, updatedTask)
            setTaskList(taskList.map(task => (task._id === updatedTask._id ? updatedTask : task)))
            showSuccessMsg('Task updated successfully')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onDeleteTask(taskId) {
        try {
            await removeTask(board._id, group._id, taskId)
            setTaskList(taskList.filter(task => task._id !== taskId))
            showSuccessMsg('Task deleted successfully')
        } catch (err) {
            showErrorMsg('Cannot delete task')
        }
    }

    const columns = Object.keys(taskAttributesConfig).map(key => ({
        key,
        title: taskAttributesConfig[key].label,
        width: taskAttributesConfig[key].width || 'auto',
    }))

    const summary = calculateSummary(taskList)

    return (
        <Droppable droppableId={group._id} type='TASK'>
            {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <div className='tasks-list-container'>
                        <Button onClick={onAddTask}>New task</Button>
                        <Table
                            columns={columns}
                            style={{
                                borderInlineStart: `${group.style.backgroundColor || '#579bfc'} 6px solid`,
                                overflow: 'visible',
                            }}
                        >
                            <TableHeader>
                                {columns.map((headerCell, index) => (
                                    <TableHeaderCell
                                        key={index}
                                        title={headerCell.title}
                                        className={
                                            index === 0
                                                ? 'table-header-cell sticky-col task-col flex align-center justify-center'
                                                : 'table-header-cell flex align-center justify-center'
                                        }
                                        style={{ width: headerCell.width }}
                                    />
                                ))}
                            </TableHeader>
                            <TableBody>
                                {!isCollapsed &&
                                    taskList.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {provided => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <TaskPreview
                                                        task={task}
                                                        members={members}
                                                        labels={labels}
                                                        board={board}
                                                        group={group}
                                                        openModal={openModal}
                                                        onUpdateTask={onUpdateTask}
                                                        onDeleteTask={onDeleteTask}
                                                        provided={provided}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </TableBody>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={col.key}
                                        className={`summary-cell ${index === 0 ? 'task-summary-cell' : ''}`}
                                        style={{ width: col.width }}
                                    >
                                        {col.key === 'files' && `${summary.files} files`}
                                        {col.key === 'status' && renderProgressBar(summary.status, getStatusStyle)}
                                        {col.key === 'priority' &&
                                            renderProgressBar(summary.priority, getPriorityStyle)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </Table>
                    </div>
                </div>
            )}
        </Droppable>
    )
}

export default TasksList