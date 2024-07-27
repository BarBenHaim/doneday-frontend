import React, { useState } from 'react'
import { TableCell, TableRow, MenuButton, Menu, MenuItem } from 'monday-ui-react-core'
import { Delete } from 'monday-ui-react-core/icons'
import { taskAttributesConfig } from './taskAttributesConfig'

export function TaskPreview({
    task,
    members,
    labels,
    onUpdateTask,
    onDeleteTask,
    provided,
    cmpsOrder,
    selectedTasks,
    handleCheckboxChange,
    handleSelectAllCheckboxChange,
    isPlaceholder,
}) {
    function onUpdateField(task, field, value) {
        const updatedTask = { ...task, [field]: value }
        console.log(value)
        onUpdateTask(updatedTask)
    }

    const [highlighted, setHighlighted] = useState(false)

    async function onDeleteTaskHandler() {
        await onDeleteTask(task._id)
    }

    const renderCell = (config, task, members, labels, key) => {
        const { render, className, width } = config || {}
        return (
            <TableCell key={key} className={className || ''} style={{ width, flexGrow: key === 'addColumn' ? 1 : 0 }}>
                {render
                    ? render(task, members, labels, onUpdateField, key, {
                          selectedTasks,
                          handleCheckboxChange,
                          handleSelectAllCheckboxChange,
                      })
                    : null}
            </TableCell>
        )
    }

    function handlePlaceholderInput(event) {
        if (isPlaceholder && event.target.value.trim()) {
            onUpdateTask(task)
        }
    }

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='task-preview-container'
            style={{ cursor: isPlaceholder ? 'text' : 'grab' }}
            onFocus={() => setHighlighted(true)}
            onBlur={() => setHighlighted(false)}
        >
            {!isPlaceholder && (
                <MenuButton className='task-preview-menu-btn'>
                    <Menu id='menu' size='medium'>
                        <MenuItem onClick={onDeleteTaskHandler} icon={Delete} title='Delete' />
                    </Menu>
                </MenuButton>
            )}
            <TableRow className='task-preview-row' highlighted={highlighted}>
                {cmpsOrder.map(key =>
                    renderCell(taskAttributesConfig[key.match(/^\D+/)[0]], task, members, labels, key)
                )}
                <TableCell key='addColumn' className='table-cell add-column-cell' style={{ width: '100%' }}>
                    {isPlaceholder && <input type='text' onChange={handlePlaceholderInput} />}
                </TableCell>
            </TableRow>
        </div>
    )
}

export default TaskPreview
