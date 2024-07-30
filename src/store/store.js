import { legacy_createStore as createStore, combineReducers } from 'redux'

import { boardReducer } from './reducers/board.reducer.js'
import { userReducer } from './reducers/user.reducer'
import { commentReducer } from './reducers/comment.reducer.js'
import { systemReducer } from './reducers/system.reducer'

const rootReducer = combineReducers({
    boardModule: boardReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    commentModule: commentReducer,
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : undefined
export const store = createStore(rootReducer, middleware)
