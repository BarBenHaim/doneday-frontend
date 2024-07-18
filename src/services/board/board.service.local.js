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
  addGroup,
  updateGroup,
  deleteGroup: removeGroup,
  addTask,
  updateTask,
  deleteTask,
}

async function query(filterBy) {
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

async function save(board) {
  if (board._id) {
    return await storageService.put(STORAGE_KEY, board)
  } else {
    board._id = makeId()
    return await storageService.post(STORAGE_KEY, board)
  }
}

async function addBoardMsg(boardId, txt) {
  const board = await getById(boardId)
  const msg = {
    _id: makeId(),
    by: userService.getLoggedinUser(),
    txt,
  }
  board.msgs.push(msg)
  await storageService.put(STORAGE_KEY, board)
  return msg
}

async function addGroup(boardId, groupTitle) {
  const board = await getById(boardId)
  const group = getEmptyGroup(groupTitle)
  board.groups.push(group)
  await storageService.put(STORAGE_KEY, board)
  return group
}

async function updateGroup(boardId, groupId, updatedGroup) {
  const board = await getById(boardId)
  const groupIdx = board.groups.findIndex((group) => group._id === groupId)
  if (groupIdx === -1) throw new Error('Group not found')
  board.groups[groupIdx] = { ...board.groups[groupIdx], ...updatedGroup }
  await storageService.put(STORAGE_KEY, board)
  return board.groups[groupIdx]
}

async function removeGroup(boardId, groupId) {
  const board = await getById(boardId)
  const groupIdx = board.groups.findIndex((group) => group._id === groupId)
  if (groupIdx === -1) throw new Error('Group not found')
  const deletedGroup = board.groups.splice(groupIdx, 1)
  await storageService.put(STORAGE_KEY, board)
  return deletedGroup
}

async function addTask(boardId, groupId, taskTitle) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  const task = getEmptyTask(taskTitle)
  group.tasks.push(task)
  await storageService.put(STORAGE_KEY, board)
  return task
}

async function updateTask(boardId, groupId, taskId, updatedTask) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  const taskIdx = group.tasks.findIndex((task) => task._id === taskId)
  if (taskIdx === -1) throw new Error('Task not found')
  group.tasks[taskIdx] = { ...group.tasks[taskIdx], ...updatedTask }
  await storageService.put(STORAGE_KEY, board)
  return group.tasks[taskIdx]
}

async function deleteTask(boardId, groupId, taskId) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  const taskIdx = group.tasks.findIndex((task) => task._id === taskId)
  if (taskIdx === -1) throw new Error('Task not found')
  const deletedTask = group.tasks.splice(taskIdx, 1)
  await storageService.put(STORAGE_KEY, board)
  return deletedTask
}

function getEmptyGroup(title = '') {
  return {
    _id: makeId(),
    title: title,
    archivedAt: null,
    style: {},
    tasks: [],
  }
}

function getEmptyTask(title = '') {
  return {
    _id: makeId(),
    title: title,
    description: '',
    status: '',
    priority: '',
    dueDate: null,
    members: [],
    labels: [],
    comments: [],
  }
}
