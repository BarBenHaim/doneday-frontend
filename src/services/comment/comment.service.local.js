import { storageService } from '../async-storage.service'
import { userService } from '../user'

export const commentService = {
	add,
	query,
	remove,
}

function query(filterBy) {
	return storageService.query('board')
}

async function remove(commentId) {
	await storageService.remove('board', commentId)
}

async function add({ txt, aboutUserId }) {
	const aboutUser = await userService.getById(aboutUserId)
	const commentToAdd = {
		title,
		byUser: userService.getLoggedinUser(),
		aboutUser: {
			_id: aboutUser._id,
			fullname: aboutUser.fullname,
			imgUrl: aboutUser.imgUrl,
		},
	}

	commentToAdd.byUser.score += 10
	await userService.update(commentToAdd.byUser)

	const addedComment = await storageService.post('comment', commentToAdd)
	return addedComment
}