export const SET_COMMENTS = 'SET_COMMENTS'
export const ADD_COMMENT = 'ADD_COMMENT'
export const REMOVE_COMMENT = 'REMOVE_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'

const initialState = {
  comments: [],
}

export function commentReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_COMMENTS:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.boardId
            ? {
                ...board,
                groups: board.groups.map((group) =>
                  group._id === action.groupId
                    ? {
                        ...group,
                        tasks: group.tasks.map((task) =>
                          task._id === action.taskId
                            ? { ...task, comments: action.comments }
                            : task
                        ),
                      }
                    : group
                ),
              }
            : board
        ),
      };

    case ADD_COMMENT:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.payload.boardId
            ? {
                ...board,
                groups: board.groups.map((group) =>
                  group._id === action.payload.groupId
                    ? {
                        ...group,
                        tasks: group.tasks.map((task) =>
                          task._id === action.payload.taskId
                            ? { ...task, comments: [action.payload.comment, ...task.comments] }
                            : task
                        ),
                      }
                    : group
                ),
              }
            : board
        ),
      };

    case REMOVE_COMMENT:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.payload.boardId
            ? {
                ...board,
                groups: board.groups.map((group) =>
                  group._id === action.payload.groupId
                    ? {
                        ...group,
                        tasks: group.tasks.map((task) =>
                          task._id === action.payload.taskId
                            ? { ...task, comments: task.comments.filter(comment => comment._id !== action.payload.commentId) }
                            : task
                        ),
                      }
                    : group
                ),
              }
            : board
        ),
      };

    case UPDATE_COMMENT:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board._id === action.payload.boardId
            ? {
                ...board,
                groups: board.groups.map((group) =>
                  group._id === action.payload.groupId
                    ? {
                        ...group,
                        tasks: group.tasks.map((task) =>
                          task._id === action.payload.taskId
                            ? {
                                ...task,
                                comments: task.comments.map((comment) =>
                                  comment._id === action.payload.commentId
                                    ? { ...comment, ...action.payload.updatedComment }
                                    : comment
                                ),
                              }
                            : task
                        ),
                      }
                    : group
                ),
              }
            : board
        ),
      };

    default:
      return state;
  }
}
