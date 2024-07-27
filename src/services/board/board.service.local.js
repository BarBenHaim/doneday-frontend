import { storageService } from '../async-storage.service'
import {
  createBoard,
  createBoards,
  createGroup,
  createMember,
  createTask,
  makeId,
  saveToStorage,
} from '../util.service'
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
  removeGroup,
  addTask,
  addTaskBottom,
  updateTask,
  removeTask,
  toggleStarred,
  addBoard,
  updateBoard,
  addActivity,
}

async function query(filterBy) {
  var boards = await storageService.query(STORAGE_KEY)
  if (!boards || !boards.length) boards = createBoards()
  saveToStorage(STORAGE_KEY, boards)
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
    return await storageService.post(STORAGE_KEY, board)
  }
}

async function updateBoard(boardId, updatedBoard) {
  const board = await getById(boardId)
  console.log('update board', board)
  const boardIdx = board.findIndex((board) => board._id === boardId)
  if (boardIdx === -1) throw new Error('Board not found')
  board[boardIdx] = { ...board[boardIdx], ...updatedBoard }
  await storageService.put(STORAGE_KEY, board)
  return board[boardIdx]
}

async function addBoardMsg(boardId, txt) {
  const board = await getById(boardId)
  const msg = {
    by: userService.getLoggedinUser(),
    txt,
  }
  board.msgs.push(msg)
  await storageService.put(STORAGE_KEY, board)
  return msg
}

async function toggleStarred(boardId) {
  try {
    console.log('service toggle starred', boardId)
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    board.isStarred = !board.isStarred

    const updatedBoard = await save(board)
    return updatedBoard
  } catch (err) {
    console.log('Cannot toggle starred status', err)
    throw err
  }
}

function getEmptyGroup(title = '') {
  return {
    _id: makeId(),
    title,
    archivedAt: null,
    style: {},
    tasks: [],
  }
}

function getEmptyTask(title = '') {
  return {
    _id: makeId(),
    title: 'New Task',
    description: '',
    status: '',
    priority: '',
    dueDate: null,
    members: [],
    labels: [],
    comments: [],
  }
}

async function updateGroup(boardId, groupId, updatedGroup) {
  const board = await getById(boardId)
  console.log(board)
  console.log(boardId)
  const groupIdx = board.groups.findIndex((group) => group._id === groupId)
  if (groupIdx === -1) throw new Error('Group not found')
  board.groups[groupIdx] = { ...board.groups[groupIdx], ...updatedGroup }
  await storageService.put(STORAGE_KEY, board)
  return board.groups[groupIdx]
}

async function addGroup(boardId, groupTitle) {
  const board = await getById(boardId)
  const group = getEmptyGroup(groupTitle)
  board.groups.push(group)
  await storageService.put(STORAGE_KEY, board)
  return group
}
async function addActivity(boardId, activity) {
  const board = await getById(boardId)
  // const activity = getEmptyGroup(groupTitle)
  board.activitiess.unshift(activity)
  await storageService.put(STORAGE_KEY, board)
  return activity
}

async function removeGroup(boardId, groupId) {
  const board = await getById(boardId)
  const groupIdx = board.groups.findIndex((group) => group._id === groupId)
  if (groupIdx === -1) throw new Error('Group not found')
  const removedGroup = board.groups.splice(groupIdx, 1)
  await storageService.put(STORAGE_KEY, board)
  return removedGroup
}

async function addTask(boardId, groupId, task = getEmptyTask()) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  group.tasks.unshift(task)
  await storageService.put(STORAGE_KEY, board)
  return task
}
async function addTaskBottom(boardId, groupId, task = getEmptyTask()) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  group.tasks.push(task)
  await storageService.put(STORAGE_KEY, board)
  return task
}

async function updateTask(boardId, groupId, taskId, taskChanges) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  const taskIdx = group.tasks.findIndex((task) => task._id === taskId)
  if (taskIdx === -1) throw new Error('Task not found')
  group.tasks[taskIdx] = { ...group.tasks[taskIdx], ...taskChanges }
  await storageService.put(STORAGE_KEY, board)
  return group.tasks[taskIdx]
}

async function removeTask(boardId, groupId, taskId) {
  const board = await getById(boardId)
  const group = board.groups.find((group) => group._id === groupId)
  if (!group) throw new Error('Group not found')
  const taskIdx = group.tasks.findIndex((task) => task._id === taskId)
  if (taskIdx === -1) throw new Error('Task not found')
  const removedTask = group.tasks.splice(taskIdx, 1)
  await storageService.put(STORAGE_KEY, board)
  return removedTask
}

function getEmptyBoard(title = '', label = '') {
  return {
    _id: makeId(),
    title,
    // createdBy,
    label,
    members: [],
    groups: [],
    activities: [],
  }
}

async function addBoard(boardTitle, boardLabel) {
  const board = _createBoardDemo(boardTitle, boardLabel)
  await storageService.post(STORAGE_KEY, board)
  return board
}

function _createBoardDemo(title, label) {
  const member1 = createMember(
    'Ariella Melnikov',
    'https://res.cloudinary.com/dkykllpf5/image/upload/v1721649934/jzacprnumxyqpj1w0xah.jpg'
  )
  const task1 = createTask(label + ' 1')
  const task2 = createTask(label + ' 2')
  const task3 = createTask(label + ' 3')
  const task4 = createTask(label + ' 4')
  const task5 = createTask(label + ' 5')

  const board = createBoard(
    title,
    member1,
    label,
    [member1],
    [
      createGroup('Group Title', [task1, task2, task3]),
      createGroup('Group Title', [task4, task5]),
    ]
  )

  return board
}
