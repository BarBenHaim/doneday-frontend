import GroupPreview from './GroupPreview'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup, removeGroup, updateGroup, updateBoardOptimistic } from '../../store/actions/board.action'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import { Button, IconButton } from 'monday-ui-react-core'
import { Add } from 'monday-ui-react-core/icons'

export function GroupList({ boardsToDisplay }) {
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
        const { source, destination, type } = result

        if (!destination) return

        if (type === 'GROUP') {
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
            const updatedDestinationGroup = {
                ...destinationGroup,
                tasks: destinationTasks,
            }

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

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
            <Button onClick={onAddGroup} kind={Button.kinds.SECONDARY} size='small'>
                <div className='flex align-center justify-center'>
                    <Add size={18} />
                    <span className='flex align-center justify-center' style={{ padding: '2px' }}>
                        Add new group
                    </span>
                </div>
            </Button>
        </DragDropContext>
    )
}
