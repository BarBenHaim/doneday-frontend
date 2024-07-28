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

function getEmptyGroup(title = '', style = {}, tasks = []) {
  return {
    _id: makeId(),
    title,
    archivedAt: null,
    style,
    tasks,
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


async function addBoard(boardTitle, boardLabel) {
  const board = _createBoardDemo(boardTitle, boardLabel)
  await storageService.post(STORAGE_KEY, board)
  return board
}

function _createBoardDemo(boardTitle, boardLabel) {
  const task1 = _createTask(boardLabel + ' 1', {status: "Done", priority: "High" })
  const task2 = _createTask(boardLabel + ' 2', {status: "Working on it", priority: "Medium" } )
  const task3 = _createTask(boardLabel + ' 3' )
  const task4 = _createTask(boardLabel + ' 4' )
  const task5 = _createTask(boardLabel + ' 5' )

  return {
      title:boardTitle,
      description:'Manage any type of project. Assign owners, set timelines and keep track of where your project stands.',
      isStarred: false,
      archivedAt: null,
      // createdBy,
      label:boardLabel,
      members: [],
      groups: [getEmptyGroup('Group Title',{backgroundColor: '#579bfc'}, [task1, task2, task3]), getEmptyGroup('Group Title',{backgroundColor: '#a25ddc'}, [task4, task5], )],
      activities: [],
      cmpsOrder: [
          "checkbox",
          "title",
          "description",
          "priority",
          "dueDate",
          "memberIds",
          "status",
          "files"
      ]
  }
}


export function _createTask(title, options = {}) {
  return {
      _id: makeId(),
      title,
      archivedAt: options.archivedAt || null,
      status: options.status || 'Not Started',
      priority: options.priority ||'Low',
      dueDate: options.dueDate || null,
      description: options.description || null,
      comments: options.comments || [],
      checklists: options.checklists || [],
      memberIds: options.memberIds || [],
      byMember: options.byMember || null,
      style: options.style || {},
  }
}