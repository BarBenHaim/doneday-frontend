import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addBoardMsg,
    addGroup,
    updateGroup,
    removeGroup,
    addTask,
    addTaskBottom,
    updateTask,
    removeTask,
    toggleStarred,
    updateBoard,
}

async function query() {
    return httpService.get(`board`)
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

async function addBoardMsg(boardId, txt) {
    return httpService.post(`board/${boardId}/msg`, { txt })
}

async function addGroup(boardId, groupTitle) {
    return httpService.post(`board/${boardId}/group`, { title: groupTitle })
}

async function updateGroup(boardId, groupId, updatedGroup) {
    return httpService.put(`board/${boardId}/${groupId}`, updatedGroup)
}

async function removeGroup(boardId, groupId) {
    return httpService.delete(`board/${boardId}/${groupId}`)
}

async function addTask(boardId, groupId, task) {
    return httpService.post(`board/${boardId}/${groupId}/task`, task)
}

async function addTaskBottom(boardId, groupId, task) {
    return httpService.post(`board/${boardId}/${groupId}/task/bottom`, task)
}

async function updateTask(boardId, groupId, taskId, taskChanges) {
    return httpService.put(`board/${boardId}/${groupId}/${taskId}`, taskChanges)
}

async function removeTask(boardId, groupId, taskId) {
    return httpService.delete(`board/${boardId}/${groupId}/${taskId}`)
}

async function toggleStarred(boardId) {
    return httpService.post(`board/${boardId}/toggle-starred`)
}

async function updateBoard(boardId, updatedBoard) {
    return httpService.put(`board/${boardId}`, updatedBoard)
}