import React, { useState, useEffect } from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableHeaderCell,
    TableRow,
    TableCell,
    SplitButton,
    SplitButtonMenu,
    MenuItem,
} from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'
import TaskPreview from './TaskPreview'
import { taskAttributesConfig } from './taskAttributesConfig'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service'
import { addTask, updateTask, removeTask, updateBoardOptimistic } from '../../../store/actions/board.action'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Group } from 'monday-ui-react-core/icons'
import { getPriorityStyle, getStatusStyle } from './dynamicCmps/styleUtils'

function calculateSummary(taskList) {
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

function TasksList({ tasks, members, labels, board, group, openModal, onUpdateTask, onDeleteTask, isCollapsed }) {
    const [taskList, setTaskList] = useState(tasks)
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))

    useEffect(() => {
        setTaskList(tasks)
    }, [tasks, currBoard])

    async function onAddTask() {
        try {
            const addedTask = await addTask(board._id, group._id)
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

    const additionalColumn = {
        key: 'addColumn',
        title: '+',
        width: '100%',
        render: () => null,
    }

    async function onAddColumn() {
        const columnLabel = prompt('Enter the column label (status, priority, due date, etc.):')
        if (!columnLabel) return

        const newColumnKey = columnLabel.toLowerCase().replace(/ /g, '')

        // Update cmpsOrder in the board
        const updatedCmpsOrder = [...board.cmpsOrder, newColumnKey]

        // Update tasks in all groups to include the new column
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
    const columns = [
        ...board.cmpsOrder.map(key => ({
            key,
            title: taskAttributesConfig[key].label,
            width: taskAttributesConfig[key].width || 'auto',
        })),
        additionalColumn,
    ]

    const summary = calculateSummary(taskList)
    const boardLabelName = currBoard.label.toLowerCase()

    return (
        <Droppable droppableId={group._id} type='TASK'>
            {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <SplitButton
                        children={'New ' + boardLabelName}
                        onClick={onAddTask}
                        size='small'
                        secondaryDialogContent={
                            <SplitButtonMenu id='split-menu'>
                                <MenuItem icon={Group} title='Add group' onClick={() => alert('in development...')} />
                            </SplitButtonMenu>
                        }
                    />
                    <button onClick={onAddColumn} className='add-column-button'>
                        +
                    </button>
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
                            <TableHeader>
                                <TableRow
                                    style={{
                                        borderInlineStart: `${group.style.backgroundColor || '#579bfc'} 6px solid`,
                                        borderTopLeftRadius: '5px',
                                    }}
                                >
                                    {columns.map((headerCell, index) => (
                                        <TableHeaderCell
                                            key={index}
                                            title={index === 0 ? currBoard.label : headerCell.title}
                                            className={
                                                headerCell.key === 'addColumn'
                                                    ? 'table-header-cell addCol-col flex align-center justify-center'
                                                    : index === 0
                                                    ? 'table-header-cell sticky-col task-col flex align-center justify-center'
                                                    : 'table-header-cell flex align-center justify-center'
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
                                                            borderBottomLeftRadius:
                                                                index === taskList.length - 1 ? '5px' : '0px',
                                                        }}
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
                                                            cmpsOrder={board.cmpsOrder}
                                                        />
                                                    </TableRow>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </TableBody>
                            <TableRow className='summary-row'>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={col.key}
                                        className={`summary-cell ${`summary-cell-${index}`}`}
                                        style={{
                                            width: col.width,
                                        }}
                                    >
                                        <div className='summary-cell-files'>
                                            {col.key === 'files' && `${summary.files} files`}
                                        </div>
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
