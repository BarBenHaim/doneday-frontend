import React from 'react'
import GroupPreview from './GroupPreview'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import {
  addGroup,
  updateGroup,
  deleteGroup,
} from '../store/actions/board.action'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
  addGroup,
  removeGroup,
  updateGroup,
} from '../store/actions/board.action'

export function GroupList() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )

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

  return (
    <div className="group-list">
      <button onClick={onAddGroup}>Add Group</button>
      {currBoard.groups.map((group) => (
        <div key={group._id}>
          <GroupPreview
            group={group}
            members={currBoard.members}
            labels={currBoard.labels}
          />
          <button
            onClick={() => onUpdateGroup(group._id, { title: 'Updated Title' })}
          >
            Update
          </button>
          <button onClick={() => onDeleteGroup(group._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
