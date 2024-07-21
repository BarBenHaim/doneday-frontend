import React from 'react'
import { TableCell, TableRow, MenuButton, Menu, MenuItem } from 'monday-ui-react-core'
import { Duplicate, Delete } from 'monday-ui-react-core/icons'
import { taskAttributesConfig } from './taskAttributesConfig'

export function TaskPreview({ task, members, labels, onUpdateTask, onDeleteTask, provided }) {
    function onUpdateField(task, field, value) {
        const updatedTask = { ...task, [field]: value }
        onUpdateTask(updatedTask)
    }

    async function onDeleteTaskHandler() {
        await onDeleteTask(task._id)
    }

    const renderCell = (config, task, members, labels, key) => {
        const { render, className, width } = config
        return (
            <TableCell key={key} className={className || ''} style={{ width }}>
                {render(task, members, labels, onUpdateField)}
            </TableCell>
        )
    }

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='task-preview-container'
            style={{ cursor: 'grab' }}
        >
            <MenuButton className='task-preview-menu-btn'>
                <Menu id='menu' size='medium'>
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
