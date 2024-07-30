import { httpService } from '../http.service'

export const commentService = {
	getComments,
	addComment,
	updateComment,
	deleteComment,
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
