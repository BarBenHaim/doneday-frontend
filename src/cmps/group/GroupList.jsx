import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { updateBoardOptimistic, updateGroup, removeGroup, addGroup } from '../../store/actions/board.action'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Button } from 'monday-ui-react-core'
import { Add } from 'monday-ui-react-core/icons'
import { KanbanColumn } from './KanbanColumn'
import GroupPreview from './GroupPreview'

const statuses = ['Done', 'Stuck', 'Working on it', 'Not Started', 'Important'] // Define the statuses you want

export function GroupList({ boardsToDisplay, view }) {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const [collapsedStates, setCollapsedStates] = useState({})
    const [isDragging, setIsDragging] = useState(false)
    const [initialCollapsedStates, setInitialCollapsedStates] = useState({})
    const [selectedTasks, setSelectedTasks] = useState([])

    useEffect(() => {
        const initialCollapsedStates = {}
        currBoard?.groups.forEach(group => {
            initialCollapsedStates[group._id] = false
        })
        setCollapsedStates(initialCollapsedStates)
    }, [currBoard])

    const onDragStart = result => {
        if (result.type === 'GROUP') {
            const statesBeforeDrag = {}
            boardsToDisplay.forEach(group => {
                statesBeforeDrag[group._id] = collapsedStates[group._id] || false
            })
            setInitialCollapsedStates(statesBeforeDrag)
            const collapsedDuringDrag = {}
            boardsToDisplay.forEach(group => {
                collapsedDuringDrag[group._id] = true
            })
            setCollapsedStates(collapsedDuringDrag)
            setIsDragging(true)
        }
    }

    const onDragEnd = async result => {
        setIsDragging(false)
        setCollapsedStates(initialCollapsedStates)
        const { source, destination, type, draggableId } = result

        if (!destination) return

        if (view === 'kanban' && type === 'TASK') {
            const sourceGroup = currBoard.groups.find(group => group.tasks.some(task => task._id === draggableId))
            const movedTask = sourceGroup.tasks.find(task => task._id === draggableId)
            movedTask.status = destination.droppableId

            try {
                const updatedGroups = currBoard.groups.map(group =>
                    group._id === sourceGroup._id
                        ? { ...group, tasks: group.tasks.map(task => (task._id === movedTask._id ? movedTask : task)) }
                        : group
                )
                const updatedBoard = { ...currBoard, groups: updatedGroups }
                await updateBoardOptimistic(updatedBoard)
                showSuccessMsg('Task status updated successfully')
            } catch (err) {
                showErrorMsg('Cannot update task status')
            }
        } else if (type === 'GROUP') {
            const newGroups = Array.from(boardsToDisplay)
            const [movedGroup] = newGroups.splice(source.index, 1)
            newGroups.splice(destination.index, 0, movedGroup)
            boardsToDisplay = [...newGroups]

            try {
                const updatedBoard = { ...currBoard, groups: newGroups }
                await updateBoardOptimistic(updatedBoard)
                showSuccessMsg('Group order updated successfully')
            } catch (err) {
                showErrorMsg('Cannot update group order')
            }
        } else {
            const sourceGroup = currBoard.groups.find(group => group._id === source.droppableId)
            const destinationGroup = currBoard.groups.find(group => group._id === destination.droppableId)
            const sourceTasks = Array.from(sourceGroup.tasks)
            const [movedTask] = sourceTasks.splice(source.index, 1)

            let updatedGroups
            if (source.droppableId === destination.droppableId) {
                sourceTasks.splice(destination.index, 0, movedTask)
                updatedGroups = currBoard.groups.map(group =>
                    group._id === sourceGroup._id ? { ...group, tasks: sourceTasks } : group
                )
            } else {
                const destinationTasks = Array.from(destinationGroup.tasks)
                destinationTasks.splice(destination.index, 0, movedTask)

                updatedGroups = currBoard.groups.map(group => {
                    if (group._id === sourceGroup._id) return { ...group, tasks: sourceTasks }
                    if (group._id === destinationGroup._id) return { ...group, tasks: destinationTasks }
                    return group
                })
            }

            try {
                const updatedBoard = { ...currBoard, groups: updatedGroups }
                await updateBoardOptimistic(updatedBoard)
                showSuccessMsg('Task moved successfully')
            } catch (err) {
                showErrorMsg('Cannot move task')
            }
        }
    }

    const handleCheckboxChange = taskId => {
        setSelectedTasks(prevSelected =>
            prevSelected.includes(taskId) ? prevSelected.filter(id => id !== taskId) : [...prevSelected, taskId]
        )
    }

    async function onRemoveGroup(groupId) {
        try {
            await removeGroup(boardId, groupId)
            showSuccessMsg('Group removed')
        } catch (err) {
            showErrorMsg('Cannot remove group')
        }
    }

    async function onAddGroup() {
        try {
            await addGroup(boardId, 'New Group')
            showSuccessMsg('Group added')
        } catch (err) {
            showErrorMsg('Cannot add group')
        }
    }

    async function onUpdateGroup(boardId, groupId, updatedGroup) {
        try {
            await updateGroup(boardId, groupId, updatedGroup)
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log(err)
            showErrorMsg('Cannot update group')
        }
    }

    const handleToggleCollapse = groupId => {
        setCollapsedStates(prevState => ({
            ...prevState,
            [groupId]: !prevState[groupId],
        }))
    }

    if (!currBoard) return <div>Loading...</div>

    const allTasks = currBoard.groups.flatMap(group => group.tasks)

    return (
        <section className='group-list scrollable'>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                {view === 'kanban' ? (
                    <Droppable droppableId='all-groups' type='GROUP' direction='horizontal'>
                        {provided => (
                            <div className='kanban-board' {...provided.droppableProps} ref={provided.innerRef}>
                                {statuses.map((status, index) => (
                                    <KanbanColumn
                                        key={status}
                                        status={status}
                                        tasks={allTasks}
                                        index={index}
                                        members={currBoard.members}
                                        labels={currBoard.labels}
                                        onUpdateField={onUpdateGroup}
                                        selectedTasks={selectedTasks}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ) : (
                    <Droppable droppableId='all-groups' type='GROUP' direction='vertical'>
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {boardsToDisplay.map((group, index) => (
                                    <Draggable key={group._id} draggableId={group._id} index={index}>
                                        {provided => (
                                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                                <GroupPreview
                                                    group={group}
                                                    members={currBoard.members}
                                                    labels={currBoard.labels}
                                                    onUpdateGroup={onUpdateGroup}
                                                    onRemoveGroup={onRemoveGroup}
                                                    board={currBoard}
                                                    isDragging={isDragging}
                                                    isCollapsed={collapsedStates[group._id]}
                                                    toggleCollapse={() => handleToggleCollapse(group._id)}
                                                    dragHandleProps={provided.dragHandleProps}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
                <Button onClick={onAddGroup} kind={Button.kinds.SECONDARY} size={Button.sizes.SMALL}>
                    <div className='flex align-center justify-center'>
                        <Add size={18} />
                        <span className='flex align-center justify-center' style={{ padding: '2px', fontSize: '14px' }}>
                            Add new group
                        </span>
                    </div>
                </Button>
            </DragDropContext>
        </section>
    )
}
