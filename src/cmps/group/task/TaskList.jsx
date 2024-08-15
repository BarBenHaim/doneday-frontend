import React, { useState, useEffect } from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableHeaderCell,
    TableRow,
    TableCell,
    MenuButton,
    Menu,
    MenuItem,
    Checkbox,
} from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskPreview from './TaskPreview'
import { getResponsiveWidths, taskAttributesConfig } from './taskAttributesConfig'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service'
import {
    addTaskBottom,
    updateTask,
    removeTask,
    updateBoardOptimistic,
    getEmptyTask,
} from '../../../store/actions/board.action'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Delete } from 'monday-ui-react-core/icons'
import { getPriorityStyle, getStatusStyle } from './dynamicCmps/styleUtils'
import AddColumnPopover from './AddColumnPopover'

function calculateSummary(taskList) {
    const summary = {
        files: 0,
        status: {},
        priority: {},
        earliestDueDate: null,
    }

    taskList.forEach(task => {
        for (const key in task) {
            if (key.startsWith('files')) {
                summary.files += task[key] ? task[key].length : 0
            } else if (key.startsWith('status')) {
                summary.status[task[key]] = (summary.status[key] || 0) + 1
            } else if (key.startsWith('priority')) {
                summary.priority[task[key]] = (summary.priority[task[key]] || 0) + 1
            } else if (key.startsWith('dueDate') && task[key]) {
                const dueDate = new Date(task[key])
                if (!summary.earliestDueDate || dueDate < summary.earliestDueDate) {
                    summary.earliestDueDate = dueDate
                }
            }
        }
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

function renderProgressBar(distribution, colorGetter) {
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

function formatDate(date) {
    const options = { day: 'numeric', month: 'short' }
    return new Date(date).toLocaleDateString(undefined, options)
}

function TasksList({ tasks, members, labels, board, group, openModal, onDeleteTask, isCollapsed }) {
    const [taskList, setTaskList] = useState(tasks)
    const [summary, setSummary] = useState(calculateSummary(tasks))
    const [selectedTasks, setSelectedTasks] = useState([])
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const [responsiveWidths, setResponsiveWidths] = useState(getResponsiveWidths())

    useEffect(() => {
        setTaskList(tasks)
        setSummary(calculateSummary(tasks))
    }, [tasks, currBoard])

    useEffect(() => {
        const handleResize = () => {
            setResponsiveWidths(getResponsiveWidths())
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleCheckboxChange = taskId => {
        setSelectedTasks(prevSelectedTasks =>
            prevSelectedTasks.includes(taskId)
                ? prevSelectedTasks.filter(id => id !== taskId)
                : [...prevSelectedTasks, taskId]
        )
    }

    const handleSelectAllCheckboxChange = () => {
        setSelectedTasks(taskList.length === selectedTasks.length ? [] : taskList.map(task => task._id))
    }

    const handleDeleteSelectedTasks = async () => {
        try {
            await Promise.all(selectedTasks.map(taskId => removeTask(board._id, group._id, taskId)))
            const updatedTaskList = taskList.filter(task => !selectedTasks.includes(task._id))
            setTaskList(updatedTaskList)
            setSummary(calculateSummary(updatedTaskList))
            setSelectedTasks([])
            showSuccessMsg('Selected tasks deleted successfully')
        } catch (err) {
            showErrorMsg('Cannot delete selected tasks')
        }
    }

    async function onAddTaskBottom(title = '') {
        try {
            const addedTask = await addTaskBottom(board._id, group._id, getEmptyTask(), title)
            const updatedTaskList = [...taskList, addedTask]
            setTaskList(updatedTaskList)
            setSummary(calculateSummary(updatedTaskList))
            showSuccessMsg('Task added successfully')
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }

    async function onUpdateTask(updatedTask) {
        try {
            await updateTask(board._id, group._id, updatedTask._id, updatedTask)
            const updatedTaskList = taskList.map(task => (task._id === updatedTask._id ? updatedTask : task))
            setTaskList(updatedTaskList)
            setSummary(calculateSummary(updatedTaskList))
            showSuccessMsg('Task updated successfully')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onDeleteTask(taskId) {
        try {
            await removeTask(board._id, group._id, taskId)
            const updatedTaskList = taskList.filter(task => task._id !== taskId)
            setTaskList(updatedTaskList)
            setSummary(calculateSummary(updatedTaskList))
            showSuccessMsg('Task deleted successfully')
        } catch (err) {
            showErrorMsg('Cannot delete task')
        }
    }

    const additionalColumn = {
        key: 'addColumn',
        title: <AddColumnPopover predefinedLabels={Object.keys(taskAttributesConfig)} handleAddColumn={onAddColumn} />,
        render: () => null,
        className: 'addColumn',
        width: '100%',
    }

    function generateUniqueKey(label, existingKeys) {
        let count = 1
        let newKey = `${label}${count}`
        while (existingKeys.includes(newKey)) {
            count++
            newKey = `${label}${count}`
        }
        return newKey
    }

    async function onAddColumn(columnLabel) {
        if (!columnLabel) return

        const normalizedLabel = columnLabel

        const newColumnKey = generateUniqueKey(normalizedLabel, board.cmpsOrder)
        const updatedCmpsOrder = [...board.cmpsOrder, newColumnKey]
        const updatedGroups = board.groups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => ({
                ...task,
                [newColumnKey]: '',
            })),
        }))

        const updatedBoard = {
            ...board,
            cmpsOrder: updatedCmpsOrder,
            groups: updatedGroups,
        }

        try {
            await updateBoardOptimistic(updatedBoard)
            showSuccessMsg('Column added successfully')
        } catch (err) {
            showErrorMsg('Cannot add column')
        }
    }

    async function onRemoveColumn(columnKey) {
        const updatedCmpsOrder = board.cmpsOrder.filter(key => key !== columnKey)
        const updatedGroups = board.groups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => {
                const updatedTask = { ...task }
                delete updatedTask[columnKey]
                return updatedTask
            }),
        }))

        const updatedBoard = {
            ...board,
            cmpsOrder: updatedCmpsOrder,
            groups: updatedGroups,
        }

        try {
            await updateBoardOptimistic(updatedBoard)
            showSuccessMsg('Column removed successfully')
        } catch (err) {
            showErrorMsg('Cannot remove column')
        }
    }
    const columns = [
        ...board.cmpsOrder.map(key => {
            const config = taskAttributesConfig[key.match(/^\D+/)[0]]
            return {
                key,
                title: config.headerRender ? (
                    config.headerRender(taskList, selectedTasks, handleSelectAll)
                ) : (
                    <div className='column-header-text' style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{config.label}</span>

                        <MenuButton className='column-menu-btn'>
                            <Menu id='menu' size='medium'>
                                <MenuItem onClick={() => onRemoveColumn(key)} icon={Delete} title='Delete' />
                            </Menu>
                        </MenuButton>
                    </div>
                ),
                width: responsiveWidths[key] || '140px',
            }
        }),
        additionalColumn,
    ]

    return (
        <Droppable droppableId={group._id} type='TASK'>
            {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <div className='tasks-list-container'>
                        <Table
                            className='group-table'
                            withoutBorder
                            columns={columns}
                            style={{
                                overflow: 'visible',
                                borderTopLeftRadius: '5px',
                            }}
                        >
                            <TableHeader className='table-header'>
                                <TableRow
                                    style={{
                                        borderInlineStart: `${group.style.backgroundColor || '#579bfc'} 6px solid`,
                                        borderTopLeftRadius: '5px',
                                    }}
                                >
                                    {columns.map((headerCell, index) => (
                                        <TableHeaderCell
                                            key={index}
                                            title={headerCell.title}
                                            className={
                                                headerCell.key === 'addColumn'
                                                    ? 'table-header-cell addCol-col flex align-center justify-center'
                                                    : headerCell.key === 'title'
                                                    ? 'table-header-cell sticky-col flex align-center justify-center'
                                                    : headerCell.key === 'checkbox'
                                                    ? 'table-header-checkbox'
                                                    : 'table-header-cell regular flex align-center'
                                            }
                                            style={{
                                                width: headerCell.width,
                                            }}
                                        />
                                    ))}
                                </TableRow>
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
                                                    <TableRow
                                                        style={{
                                                            borderInlineStart: `${
                                                                group.style.backgroundColor || '#579bfc'
                                                            } 6px solid`,
                                                        }}
                                                    >
                                                        <TaskPreview
                                                            task={task}
                                                            members={members}
                                                            labels={labels}
                                                            onUpdateTask={onUpdateTask}
                                                            onDeleteTask={onDeleteTask}
                                                            provided={provided}
                                                            cmpsOrder={board.cmpsOrder}
                                                            selectedTasks={selectedTasks}
                                                            handleCheckboxChange={handleCheckboxChange}
                                                            handleSelectAllCheckboxChange={
                                                                handleSelectAllCheckboxChange
                                                            }
                                                        />
                                                    </TableRow>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </TableBody>
                            <TableRow
                                className='add-task-row'
                                style={{
                                    borderInlineStart: `${group.style.backgroundColor || '#579bfc'} 6px solid`,
                                    borderBottomLeftRadius: '5px',
                                }}
                            >
                                <TableCell className='table-cell checkbox-col disable'>
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell className='add-task-row-cell'>
                                    <input
                                        className='add-task-input'
                                        type='text'
                                        onBlur={ev => {
                                            if (ev.target.value) onAddTaskBottom(ev.target.value)
                                            ev.target.value = ''
                                            return
                                        }}
                                        placeholder='+ Add task...'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow className='summary-row'>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={col.key}
                                        className={`summary-cell summary-cell-${index}`}
                                        style={{
                                            width: col.width,
                                        }}
                                    >
                                        <div className='summary-cell-files'>
                                            {col.key.startsWith('files') && `${summary.files} files`}
                                        </div>
                                        {col.key.startsWith('status') &&
                                            renderProgressBar(summary.status, getStatusStyle)}
                                        {col.key.startsWith('priority') &&
                                            renderProgressBar(summary.priority, getPriorityStyle)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </Table>
                        <button
                            onClick={handleDeleteSelectedTasks}
                            style={{
                                opacity: selectedTasks.length > 0 ? 1 : 0,
                                pointerEvents: selectedTasks.length > 0 ? 'auto' : 'none',
                            }}
                        >
                            Delete Selected Tasks
                        </button>
                    </div>
                </div>
            )}
        </Droppable>
    )
}

export default TasksList
