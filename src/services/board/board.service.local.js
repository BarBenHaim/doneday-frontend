import { storageService } from '../async-storage.service'
import { createBoards, makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addBoardMsg,
}
window.cs = boardService
async function query() {
    var boards = await storageService.query(STORAGE_KEY)
    if (!boards || !boards.length) boards = createBoards()
    return boards
}
function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {}

async function addBoardMsg(boardId, txt) {
    const board = await getById(boardId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt,
    }
    board.msgs.push(msg)
    await storageService.put(STORAGE_KEY, board)

    return msg
}
