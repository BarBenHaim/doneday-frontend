export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'
export const TOGGLE_STARRED_BOARD = 'TOGGLE_STARRED_BOARD'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SET_ACTIVE_TASK = 'SET_ACTIVE_TASK'
export const UPDATE_TASK_FIELD = 'UPDATE_TASK_FIELD'

export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const REMOVE_GROUP = 'REMOVE_GROUP'
export const ADD_TASK = 'ADD_TASK'
export const ADD_TASK_BOTTOM = 'ADD_TASK_BOTTOM'
export const UPDATE_TASK = 'UPDATE_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const REVERT_BOARD = 'REVERT_BOARD'
export const ADD_ACTIVITY = 'REVERT_BOARD'
export const SET_BOARD_ACTIVITIES = 'SET_BOARD_ACTIVITIES'

const initialState = {
    boards: [],
    board: null,
    groupTaskFilterBy: {},
    boardFilterBy: {},
    isModalOpen: false,
    activeTask: null,
    activities: [],
}

export function boardReducer(state = initialState, action) {
    let newState = state
    let boards
    switch (action.type) {
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedBoard: lastRemovedBoard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            boards = state.boards.map(board => (board._id === action.board._id ? action.board : board))
            newState = { ...state, boards }
            break
        case ADD_BOARD_MSG:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    msgs: [...(state.board.msgs || []), action.msg],
                },
            }
            break
        case TOGGLE_STARRED_BOARD:
            boards = state.boards.map(board =>
                board._id === action.boardId ? { ...board, isStarred: !board.isStarred } : board
            )
            newState = { ...state, boards }
            break
        case REVERT_BOARD:
            newState = { ...state, boards: state.boards }
            break
        case ADD_GROUP:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: [...board.groups, action.payload.group],
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case UPDATE_GROUP:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId ? action.payload.group : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case REMOVE_GROUP:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.filter(group => group._id !== action.payload.groupId),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case ADD_TASK:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId
                                  ? {
                                        ...group,
                                        tasks: [action.payload.task, ...group.tasks],
                                    }
                                  : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case ADD_TASK_BOTTOM:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId
                                  ? {
                                        ...group,
                                        tasks: [...group.tasks, action.payload.task],
                                    }
                                  : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case UPDATE_TASK:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId
                                  ? {
                                        ...group,
                                        tasks: group.tasks.map(task =>
                                            task._id === action.payload.taskId ? action.payload.task : task
                                        ),
                                    }
                                  : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case REMOVE_TASK:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId
                                  ? {
                                        ...group,
                                        tasks: group.tasks.filter(task => task._id !== action.payload.taskId),
                                    }
                                  : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case REMOVE_TASK:
            boards = state.boards.map(board =>
                board._id === action.payload.boardId
                    ? {
                          ...board,
                          groups: board.groups.map(group =>
                              group._id === action.payload.groupId
                                  ? {
                                        ...group,
                                        tasks: group.tasks.filter(task => task._id !== action.payload.taskId),
                                    }
                                  : group
                          ),
                      }
                    : board
            )
            newState = { ...state, boards }
            break
        case OPEN_MODAL:
            newState = { ...state, isModalOpen: true }
            break
        case CLOSE_MODAL:
            newState = { ...state, isModalOpen: false }
            break
        case SET_ACTIVE_TASK:
            return { ...state, activeTask: action.task }
        case SET_BOARD_ACTIVITIES:
            newState = { ...state, activities: action.activities }
            break
        default:
            return state
    }
    return newState
}
