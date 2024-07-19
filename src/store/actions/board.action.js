import { boardService } from '../../services/board'
import { store } from '../store'
import {
  ADD_BOARD,
  REMOVE_BOARD,
  SET_BOARDS,
  SET_BOARD,
  UPDATE_BOARD,
  ADD_BOARD_MSG,
  ADD_GROUP,
  UPDATE_GROUP,
  REMOVE_GROUP,
  ADD_TASK,
  UPDATE_TASK,
  REMOVE_TASK,
} from '../reducers/board.reducer'
import { showSuccessMsg } from '../../services/event-bus.service'

export async function loadBoards(filterBy) {
  try {
    const { groupTaskFilterBy } = store.getState()
    // const boards = await boardService.query(groupTaskFilterBy)
    const boards = await boardService.query(groupTaskFilterBy)
    store.dispatch(getCmdSetBoards(boards))
  } catch (err) {
    console.log('Cannot load boards', err)
    throw err
  }
}

export async function loadBoard(boardId) {
  try {
    const { groupTaskFilterBy } = store.getState()

    const board = await boardService.getById(boardId)
    // const filteredBoard = boardService.getFilteredBoard(groupTaskFilterBy)
    store.dispatch(getCmdSetBoard(board))
  } catch (err) {
    console.log('Cannot load board', err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    store.dispatch(getCmdRemoveBoard(boardId))
  } catch (err) {
    console.log('Cannot remove board', err)
    throw err
  }
}

export async function addBoard(board) {
  try {
    const savedBoard = await boardService.save(board)
    store.dispatch(getCmdAddBoard(savedBoard))
    return savedBoard
  } catch (err) {
    console.log('Cannot add board', err)
    throw err
  }
}

export async function updateBoard(board) {
  try {
    const savedBoard = await boardService.save(board)
    store.dispatch(getCmdUpdateBoard(savedBoard))
    return savedBoard
  } catch (err) {
    console.log('Cannot save board', err)
    throw err
  }
}

export async function addBoardMsg(boardId, txt) {
  try {
    const msg = await boardService.addBoardMsg(boardId, txt)
    store.dispatch(getCmdAddBoardMsg(msg))
    return msg
  } catch (err) {
    console.log('Cannot add board msg', err)
    throw err
  }
}

export function toggleStarredBoard(boardId) {
  return async (dispatch) => {
    try {
      const updatedBoard = await boardService.toggleStarred(boardId)
      dispatch({ type: TOGGLE_STARRED_BOARD, boardId: updatedBoard._id })
    } catch (err) {
      console.log('Cannot toggle starred status', err)
    }
  }
}

export async function updateGroup(boardId, groupId, updatedGroup) {
  try {
    const group = await boardService.updateGroup(boardId, groupId, updatedGroup)
    store.dispatch(getCmdUpdateGroup(boardId, groupId, group))
    return group
  } catch (err) {
    console.log('Cannot update group', err)
    throw err
  }
}

export async function addGroup(boardId, groupTitle) {
  try {
    const group = await boardService.addGroup(boardId, groupTitle)
    store.dispatch(getCmdAddGroup(boardId, group))
    return group
  } catch (err) {
    console.log('Cannot add group', err)
    throw err
  }
}

export async function removeGroup(boardId, groupId) {
  try {
    await boardService.removeGroup(boardId, groupId)
    store.dispatch(getCmdRemoveGroup(boardId, groupId))
  } catch (err) {
    console.log('Cannot delete group', err)
    throw err
  }
}

export async function addTask(boardId, groupId, task) {
    try {
        const newTask = await boardService.addTask(boardId, groupId, task)
        store.dispatch(getCmdAddTask(boardId, groupId, newTask))
        showSuccessMsg('Task added successfully')
        return newTask
    } catch (err) {
        showErrorMsg('Cannot add task')
        console.error('Cannot add task', err)
        throw err
    }
}

export async function updateTask(boardId, groupId, taskId, taskChanges, actionType) {
    try {
        const updatedTask = await boardService.updateTask(boardId, groupId, taskId, taskChanges)
        store.dispatch(getCmdUpdateTask(boardId, groupId, taskId, updatedTask))
        showSuccessMsg('Task updated successfully')
        return updatedTask
    } catch (err) {
        console.log('Cannot update task', err)
        throw err
    }
}

export async function removeTask(boardId, groupId, taskId) {
    try {
        await boardService.removeTask(boardId, groupId, taskId)
        store.dispatch(getCmdRemoveTask(boardId, groupId, taskId))
        showSuccessMsg('Task removed successfully')
    } catch (err) {
        console.log('Cannot remove task', err)
        throw err
    }
}

// Command Creators:
function getCmdSetBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  }
}
function getCmdSetBoard(board) {
  return {
    type: SET_BOARD,
    board,
  }
}
function getCmdRemoveBoard(boardId) {
  return {
    type: REMOVE_BOARD,
    boardId,
  }
}
function getCmdAddBoard(board) {
  return {
    type: ADD_BOARD,
    board,
  }
}
function getCmdUpdateBoard(board) {
  return {
    type: UPDATE_BOARD,
    board,
  }
}
function getCmdAddBoardMsg(msg) {
  return {
    type: ADD_BOARD_MSG,
    msg,
  }
}

function getCmdAddGroup(boardId, group) {
  return {
    type: ADD_GROUP,
    payload: { boardId, group },
  }
}

function getCmdUpdateGroup(boardId, groupId, group) {
  return {
    type: UPDATE_GROUP,
    payload: { boardId, groupId, group },
  }
}

function getCmdDeleteGroup(boardId, groupId) {
  return {
    type: DELETE_GROUP,
    payload: { boardId, groupId },
  }
}
function getCmdRemoveGroup(boardId, groupId) {
  return {
    type: REMOVE_GROUP,
    payload: { boardId, groupId },
  }
}

function getCmdAddTask(boardId, groupId, task) {
  return {
    type: ADD_TASK,
    payload: { boardId, groupId, task },
  }
}

function getCmdUpdateTask(boardId, groupId, taskId, task) {
  return {
    type: UPDATE_TASK,
    payload: { boardId, groupId, taskId, task },
  }
}

function getCmdRemoveTask(boardId, groupId, taskId) {
    return {
        type: REMOVE_TASK,
        payload: { boardId, groupId, taskId },
    }
}
// unitTestActions()
async function unitTestActions() {
  await loadBoards()
  await addBoard(boardService.getEmptyBoard())
  await updateBoard({
    _id: 'm1oC7',
    title: 'Board-Good',
  })
  await removeBoard('m1oC7')
  // TODO unit test addBoardMsg
}
