import React, { useState, useEffect } from 'react'
import GroupPreview from './GroupPreview'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup, removeGroup, updateGroup, updateBoard } from '../../store/actions/board.action'
import { GroupFilter } from './GroupFilter'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export function GroupList({ boardToDisplay }) {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const [collapsedStates, setCollapsedStates] = useState({})
    const [isDragging, setIsDragging] = useState(false)
    const [initialCollapsedStates, setInitialCollapsedStates] = useState({})

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
            arrayToDisplay.forEach(group => {
                statesBeforeDrag[group._id] = collapsedStates[group._id] || false
            })
            setInitialCollapsedStates(statesBeforeDrag)
            const collapsedDuringDrag = {}
            arrayToDisplay.forEach(group => {
                collapsedDuringDrag[group._id] = true
            })
            setCollapsedStates(collapsedDuringDrag)
            setIsDragging(true)
        }
    }

    const onDragEnd = async result => {
        setIsDragging(false)
        setCollapsedStates(initialCollapsedStates)
        const { source, destination, type } = result

        if (!destination) return

        if (type === 'GROUP') {
            const newGroups = Array.from(arrayToDisplay)
            const [movedGroup] = newGroups.splice(source.index, 1)
            newGroups.splice(destination.index, 0, movedGroup)
            setArrayToDisplay(newGroups)

            try {
                const updatedBoard = { ...currBoard, groups: newGroups }
                await updateBoard(updatedBoard)
                showSuccessMsg('Group order updated successfully')
            } catch (err) {
                showErrorMsg('Cannot update group order')
            }
            return
        }

        const sourceGroup = currBoard.groups.find(group => group._id === source.droppableId)
        const destinationGroup = currBoard.groups.find(group => group._id === destination.droppableId)

        const sourceTasks = Array.from(sourceGroup.tasks)
        const [movedTask] = sourceTasks.splice(source.index, 1)

        if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, movedTask)
            const updatedGroup = { ...sourceGroup, tasks: sourceTasks }
            await updateGroup(boardId, sourceGroup._id, updatedGroup)
        } else {
            const destinationTasks = Array.from(destinationGroup.tasks)
            destinationTasks.splice(destination.index, 0, movedTask)

            const updatedSourceGroup = { ...sourceGroup, tasks: sourceTasks }
            const updatedDestinationGroup = { ...destinationGroup, tasks: destinationTasks }

            await updateGroup(boardId, sourceGroup._id, updatedSourceGroup)
            await updateGroup(boardId, destinationGroup._id, updatedDestinationGroup)
        }

        showSuccessMsg('Task moved successfully')
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

    async function onUpdateGroup(groupId, updatedGroup) {
        try {
            await updateGroup(boardId, groupId, updatedGroup)
            showSuccessMsg('Group updated')
        } catch (err) {
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

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable droppableId='all-groups' type='GROUP' direction='vertical'>
                {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {arrayToDisplay.map((group, index) => (
                            <Draggable key={group._id} draggableId={group._id} index={index}>
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <GroupPreview
                                            group={group}
                                            members={currBoard.members}
                                            labels={currBoard.labels}
                                            onUpdateGroup={onUpdateGroup}
                                            board={currBoard}
                                            isDragging={isDragging}
                                            isCollapsed={collapsedStates[group._id]}
                                            toggleCollapse={() => handleToggleCollapse(group._id)}
                                        />
                                        <button onClick={() => onRemoveGroup(group._id)}>Delete</button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <button onClick={onAddGroup}>Add Group</button>
        </DragDropContext>
    )
}
