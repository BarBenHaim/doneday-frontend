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
    TOGGLE_STARRED_BOARD,
} from '../reducers/board.reducer'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export async function loadBoards(filterBy) {
    try {
        const { groupTaskFilterBy } = store.getState()
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
        store.dispatch(getCmdRemoveGroup(boardId, groupId))
        await boardService.removeGroup(boardId, groupId)
        showSuccessMsg('Group removed successfully')
    } catch (err) {
        showErrorMsg('Cannot remove group')
        loadBoard(boardId)
        throw err
    }
}

export async function addTask(boardId, groupId, task) {
    const taskId = `t${Date.now()}`
    const newTask = { ...task, _id: taskId }
    store.dispatch(getCmdAddTask(boardId, groupId, newTask))
    try {
        const savedTask = await boardService.addTask(boardId, groupId, newTask)
        showSuccessMsg('Task added successfully')
        return savedTask
    } catch (err) {
        showErrorMsg('Cannot add task')
        loadBoard(boardId)
        throw err
    }
}

export async function updateTask(boardId, groupId, taskId, taskChanges, actionType) {
    store.dispatch(getCmdUpdateTask(boardId, groupId, taskId, { ...taskChanges, _id: taskId }))
    try {
        const updatedTask = await boardService.updateTask(boardId, groupId, taskId, taskChanges, actionType)
        showSuccessMsg('Task updated successfully')
        return updatedTask
    } catch (err) {
        showErrorMsg('Cannot update task')
        loadBoard(boardId)
        throw err
    }
}

export async function removeTask(boardId, groupId, taskId) {
    store.dispatch(getCmdRemoveTask(boardId, groupId, taskId))
    try {
        await boardService.removeTask(boardId, groupId, taskId)
        showSuccessMsg('Task removed successfully')
    } catch (err) {
        showErrorMsg('Cannot remove task')
        loadBoard(boardId)
        throw err
    }
}

export async function toggleStarredBoard(boardId) {
    try {
        const updatedBoard = await boardService.toggleStarred(boardId)
        store.dispatch(getCmdToggleStarredBoard(updatedBoard))
    } catch (err) {
        console.log('Cannot toggle starred status', err)
    }
}

// Command Creators
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

export function getCmdToggleStarredBoard(boardId) {
    return { type: TOGGLE_STARRED_BOARD, boardId }
}
