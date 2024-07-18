import React from 'react'
import GroupPreview from './GroupPreview'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup, removeGroup, updateGroup } from '../../store/actions/board.action'
import { GroupFilter } from './GroupFilter'

export function GroupList() {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
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
        console.log(updatedGroup)
        try {
            await updateGroup(boardId, groupId, updatedGroup)
            showSuccessMsg('Group updated')
        } catch (err) {
            showErrorMsg('Cannot update group')
        }
    }

    if (!currBoard) return <div>Loading...</div>

    return (
        <div className='group-list'>
            <GroupFilter />
            {currBoard.groups.map(group => (
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
    )
}
