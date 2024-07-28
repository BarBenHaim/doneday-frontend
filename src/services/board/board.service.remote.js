import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    addBoard,
    updateBoard,
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

async function addBoard(boardTitle, boardLabel) {
    return httpService.post(`board`, { title: boardTitle, label:boardLabel })
}

async function updateBoard(board) {
    return httpService.put(`board/${board._id}`, board)
}

async function save(board) {
    if (board._id) {
        await httpService.put(`board/${board._id}`, board)
    } else {
         await httpService.post('board', board)
    }
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

