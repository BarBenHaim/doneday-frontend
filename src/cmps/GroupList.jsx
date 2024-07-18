import React from 'react'
import GroupPreview from './GroupPreview.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import {
  addGroup,
  updateGroup,
  deleteGroup,
} from '../store/actions/board.action'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function GroupList() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  console.log(currBoard)
  async function onAddGroup() {
    const groupTitle = 'New Group Title'
    try {
      const savedGroup = await dispatch(addGroup(boardId, groupTitle))
      showSuccessMsg(`Group added (id: ${savedGroup._id}`)
    } catch (err) {
      showErrorMsg('Cannot add group')
    }
  }

  async function onUpdateGroup(groupId, updatedGroup) {
    try {
      await dispatch(updateGroup(boardId, groupId, updatedGroup))
      showSuccessMsg('Group updated')
    } catch (err) {
      showErrorMsg('Cannot update group')
    }
  }

  async function onDeleteGroup(groupId) {
    try {
      await dispatch(deleteGroup(boardId, groupId))
      showSuccessMsg('Group deleted')
    } catch (err) {
      showErrorMsg('Cannot delete group')
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
