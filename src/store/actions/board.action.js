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
  DELETE_GROUP,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from '../reducers/board.reducer'

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

export function addGroup(boardId, groupTitle) {
  return async (dispatch) => {
    try {
      const group = await boardService.addGroup(boardId, groupTitle)
      dispatch(getCmdAddGroup(boardId, group))
      return group
    } catch (err) {
      console.log('Cannot add group', err)
      throw err
    }
  }
}

//todo: setFilterBy -> update the reducer

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

export async function deleteGroup(boardId, groupId) {
  try {
    await boardService.deleteGroup(boardId, groupId)
    store.dispatch(getCmdDeleteGroup(boardId, groupId))
  } catch (err) {
    console.log('Cannot delete group', err)
    throw err
  }
}

export async function addTask(boardId, groupId, taskTitle) {
  try {
    const task = await boardService.addTask(boardId, groupId, taskTitle)
    store.dispatch(getCmdAddTask(boardId, groupId, task))
    return task
  } catch (err) {
    console.log('Cannot add task', err)
    throw err
  }
}

export async function updateTask(boardId, groupId, taskId, updatedTask) {
  try {
    const task = await boardService.updateTask(
      boardId,
      groupId,
      taskId,
      updatedTask
    )
    store.dispatch(getCmdUpdateTask(boardId, groupId, taskId, task))
    return task
  } catch (err) {
    console.log('Cannot update task', err)
    throw err
  }
}

export async function deleteTask(boardId, groupId, taskId) {
  try {
    await boardService.deleteTask(boardId, groupId, taskId)
    store.dispatch(getCmdDeleteTask(boardId, groupId, taskId))
  } catch (err) {
    console.log('Cannot delete task', err)
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

function getCmdDeleteTask(boardId, groupId, taskId) {
  return {
    type: DELETE_TASK,
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
