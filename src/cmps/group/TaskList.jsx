import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableBody, TableHeaderCell, Button, TableRow } from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskPreview from './TaskPreview'
import { taskAttributesConfig } from './taskAttributesConfig'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { addTask, updateTask, removeTask } from '../../store/actions/board.action'

function TasksList({ tasks, members, labels, board, group, openModal, formattedDateRange, handleDateChange }) {
    const [taskList, setTaskList] = useState(tasks)

    useEffect(() => {
        setTaskList(tasks)
    }, [tasks])

    async function onAddTask() {
        const newTask = {
            _id: `t${Date.now()}`,
            title: 'New Task',
            memberIds: [],
            labelIds: [],
            status: '',
            dueDate: null,
            priority: 'Medium',
            comments: [],
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
        title: taskAttributesConfig[key].label,
        width: taskAttributesConfig[key].width || 'auto',
    }))
    {
        console.log(columns)
    }
    return (
        <div className='tasks-list-container'>
            <Button onClick={onAddTask}>New task</Button>
            <div style={{ overflowX: 'auto' }}>
                <Table
                    columns={columns}
                    style={{
                        maxHeight: '220px',
                        borderInlineStart: `${group.style.backgroundColor || '#579bfc'} 6px solid`,
                    }}
                >
                    <TableHeader zIndex='0'>
                        {columns.map((headerCell, index) => (
                            <TableHeaderCell
                                key={index}
                                title={headerCell.title}
                                className={index === 0 ? 'sticky-col task-col' : ''}
                                style={{ width: headerCell.width }}
                            />
                        ))}
                    </TableHeader>
                    <TableBody>
                        {taskList.map((task, index) => (
                            <TableRow key={index}>
                                <TaskPreview
                                    task={task}
                                    members={members}
                                    labels={labels}
                                    board={board}
                                    group={group}
                                    openModal={openModal}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TasksList
