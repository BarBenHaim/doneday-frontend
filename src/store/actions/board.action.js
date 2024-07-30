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
    ADD_TASK_BOTTOM,
    UPDATE_TASK,
    REMOVE_TASK,
    TOGGLE_STARRED_BOARD,
    REVERT_BOARD,
    CLOSE_MODAL,
    OPEN_MODAL,
    SET_ACTIVE_TASK,
    UPDATE_TASK_FIELD,
    SET_BOARD_ACTIVITIES,
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

export async function addBoard(boardTitle, boardLabel) {
    try {
        const board = await boardService.addBoard(boardTitle, boardLabel)
        store.dispatch(getCmdAddBoard(board))
        return board
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function addExistingBoard(board) {
    try {
        const updatedBoard = await boardService.addExistingBoard(board)
        store.dispatch(getCmdAddBoard(updatedBoard))
        return updatedBoard
    } catch (err) {
        console.log('Cannot add AI-generated board', err)
        throw err
    }
}

// export async function updateBoard(board) {
//   store.dispatch(getCmdUpdateBoard(board))
//   console.log('boardID update board', board)

//   try {
//     const savedBoard = await boardService.save(board)
//     return savedBoard
//   } catch (err) {
//     console.log('Cannot save board', err)
//     throw err
//   }
// }

export async function updateBoard(board) {
    store.dispatch(getCmdUpdateBoard(board))
    console.log('boardId update board', board)
    try {
        const updatedboard = await boardService.save(board)
        return updatedboard
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
    store.dispatch(getCmdUpdateGroup(boardId, groupId, updatedGroup))
    try {
        const group = await boardService.updateGroup(boardId, groupId, updatedGroup)
        return group
    } catch (err) {
        loadBoard(boardId)
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

export async function addTask(boardId, groupId, task, title = '') {
    const taskId = `t${Date.now()}`
    const newTask = { ...task, _id: taskId, title: title || task.title }
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
export async function addTaskBottom(boardId, groupId, task, title = '') {
    const taskId = `t${Date.now()}`
    const newTask = { ...task, _id: taskId, title: title || task.title }
    store.dispatch(getCmdAddTaskBottom(boardId, groupId, newTask))
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
    showSuccessMsg('Task updated successfully')

    try {
        const updatedTask = await boardService.updateTask(boardId, groupId, taskId, taskChanges, actionType)
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

export async function toggleStarredBoard(board) {
    try {
        store.dispatch(getCmdToggleStarredBoard(board))
        const updatedBoard = await boardService.updateBoard(board)
        store.dispatch(getCmdToggleStarredBoard(updatedBoard))
        return updatedBoard
    } catch (err) {
        console.log('Cannot toggle starred status', err)
    }
}

export async function updateBoardOptimistic(board) {
    try {
        store.dispatch(getCmdUpdateBoard(board))

        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        store.dispatch(getCmdRevertBoard())
        throw err
    }
}

export const updateTaskField = (taskId, field, value) => {
    return {
        type: UPDATE_TASK_FIELD,
        taskId,
        field,
        value,
    }
}

export function openModal() {
    return {
        type: OPEN_MODAL,
    }
}

export function closeModal() {
    return {
        type: CLOSE_MODAL,
    }
}

export function setActiveTask(task) {
    return {
        type: SET_ACTIVE_TASK,
        task,
    }
}

export async function getActivities(boardId) {
    try {
        const activities = await boardService.getActivities(boardId)
        store.dispatch(getCmdSetBoardActivities(activities))
        return activities
    } catch (err) {
        console.log('Cannot get board activities', err)
        throw err
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

export function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board,
    }
}

export function getCmdUpdateBoard(board) {
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
function getCmdAddTaskBottom(boardId, groupId, task) {
    return {
        type: ADD_TASK_BOTTOM,
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

export function getCmdToggleStarredBoard(board) {
    return { type: TOGGLE_STARRED_BOARD, board }
}

export function getCmdRevertBoard() {
    return {
        type: REVERT_BOARD,
    }
}

function getCmdSetBoardActivities(activities) {
    return {
        type: SET_BOARD_ACTIVITIES,
        activities,
    }
}

export function getEmptyTask() {
    return {
        title: 'New Task',
        memberIds: [],
        labelIds: [],
        status: 'Not Started',
        dueDate: null,
        priority: 'Medium',
        comments: [],
        files: [],
        checklists: [],
        description: '',
    }
}
