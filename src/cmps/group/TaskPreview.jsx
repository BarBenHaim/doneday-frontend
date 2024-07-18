import React from 'react'
import { TableCell, TableRow, MenuButton, Menu, MenuItem } from 'monday-ui-react-core'
import { Duplicate, Delete } from 'monday-ui-react-core/icons'
import { taskAttributesConfig } from './taskAttributesConfig'
import { showSuccessMsg } from '../../services/event-bus.service'
import { removeTask, updateTask } from '../../store/actions/board.action'

export function TaskPreview({ task, board, group, members, labels, onUpdateTask, onDeleteTask }) {
    function onUpdateField(task, field, value) {
        const updatedTask = { ...task, [field]: value }
        onUpdateTask(updatedTask)
    }

    async function onDuplicateTask() {
        const newTask = { ...task, _id: `t${Date.now()}`, title: `${task.title} (Copy)` }
        await updateTask(board._id, group._id, newTask._id, newTask, 'ADD_TASK')
        showSuccessMsg('Task duplicated successfully')
    }

    async function onDeleteTaskHandler() {
        await onDeleteTask(task._id)
    }

    const renderCell = (config, task, members, labels, key) => {
        const { render, className } = config
        return (
            <TableCell key={key} className={className || ''}>
                {render(task, members, labels, onUpdateField)}
            </TableCell>
        )
    }

    return (
        <div className='task-preview-container'>
            <MenuButton className='task-preview-menu-btn'>
                <Menu id='menu' size='medium'>
                    <MenuItem onClick={onDuplicateTask} icon={Duplicate} title='Duplicate Task' />
                    <MenuItem onClick={onDeleteTaskHandler} icon={Delete} title='Delete' />
                </Menu>
            </MenuButton>
            <TableRow className='task-preview-row'>
                {Object.keys(taskAttributesConfig).map(key =>
                    renderCell(taskAttributesConfig[key], task, members, labels, key)
                )}
            </TableRow>
        </div>
    )
}

export default TaskPreview
