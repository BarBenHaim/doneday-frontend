import React, { useState, useEffect } from 'react'
import GroupPreview from './GroupPreview'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup, removeGroup, updateGroup, updateBoard } from '../../store/actions/board.action'
import { GroupFilter } from './GroupFilter'
import { DragDropContext } from 'react-beautiful-dnd'

export function GroupList() {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const [arrayToDisplay, setArrayToDisplay] = useState(currBoard?.groups || [])

    useEffect(() => {
        setArrayToDisplay(currBoard?.groups || [])
    }, [currBoard])

    const onDragEnd = async result => {
        const { source, destination } = result

        if (!destination) return
        if (source.droppableId === destination.droppableId && source.index === destination.index) return

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

    if (!currBoard) return <div>Loading...</div>
    const handleSetArrayToDisplay = arr => {
        setArrayToDisplay(arr)
    }
    const groups = arrayToDisplay ? arrayToDisplay : currBoard?.groups
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='group-list'>
                <GroupFilter setFilterBy={handleSetArrayToDisplay} />
                {groups.map(group => (
                    <div key={group._id}>
                        <GroupPreview
                            group={group}
                            members={currBoard.members}
                            labels={currBoard.labels}
                            onUpdateGroup={onUpdateGroup}
                            board={currBoard}
                        />
                        <button onClick={() => onRemoveGroup(group._id)}>Delete</button>
                    </div>
                ))}
                <button onClick={onAddGroup}>Add Group</button>
            </div>
        </DragDropContext>
    )
}
