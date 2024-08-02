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
    updateBoard,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    getActivities,
    generateBoard,
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
    return httpService.post(`board`, { title: boardTitle, label: boardLabel })
}

export async function generateBoard(desc) {
    return httpService.post(`ai/generateBoard`, desc)
}

async function updateBoard(board) {
    return httpService.put(`board/${board._id}`, board)
}

async function save(board) {
    let savedBoard
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

async function getComments(boardId, groupId, taskId) {
    return httpService.get(`board/${boardId}/${groupId}/${taskId}/comment`)
}

async function addComment(boardId, groupId, taskId, comment) {
    return httpService.post(`board/${boardId}/${groupId}/${taskId}/comment`, comment)
}

async function updateComment(boardId, groupId, taskId, commentId, updatedComment) {
    return httpService.put(`board/${boardId}/${groupId}/${taskId}/${commentId}`, updatedComment)
}

async function deleteComment(boardId, groupId, taskId, commentId) {
    return httpService.delete(`board/${boardId}/${groupId}/${taskId}/${commentId}`)
}

async function getActivities(boardId) {
    return httpService.get(`board/${boardId}/activities`)
}
