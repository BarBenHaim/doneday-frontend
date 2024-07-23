import React, { useState } from 'react'
import { TableCell, TableRow, MenuButton, Menu, MenuItem } from 'monday-ui-react-core'
import { Delete } from 'monday-ui-react-core/icons'
import { taskAttributesConfig } from './taskAttributesConfig'

export function TaskPreview({ task, members, labels, onUpdateTask, onDeleteTask, provided, cmpsOrder }) {
    const [highlighted, setHighlighted] = useState(false)

    function onUpdateField(task, field, value) {
        const updatedTask = { ...task, [field]: value }
        onUpdateTask(updatedTask)
    }

    async function onDeleteTaskHandler() {
        await onDeleteTask(task._id)
    }

    const renderCell = (config, task, members, labels, key) => {
        const { render, className, width } = config || {}
        return (
            <TableCell key={key} className={className || ''} style={{ width, flexGrow: key === 'addColumn' ? 1 : 0 }}>
                {render ? render(task, members, labels, onUpdateField, key) : null}
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
            onFocus={() => setHighlighted(true)}
            onBlur={() => setHighlighted(false)}
        >
            <MenuButton className='task-preview-menu-btn'>
                <Menu id='menu' size='medium'>
                    <MenuItem onClick={onDeleteTaskHandler} icon={Delete} title='Delete' />
                </Menu>
            </MenuButton>
            <TableRow className='task-preview-row' highlighted={highlighted}>
                {cmpsOrder.map(key =>
                    renderCell(taskAttributesConfig[key.match(/^\D+/)[0]], task, members, labels, key)
                )}
                <TableCell key='addColumn' className='table-cell add-column-cell' style={{ width: '100%' }}></TableCell>
            </TableRow>
        </div>
    )
}

export default TaskPreview
