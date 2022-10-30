import * as tasksActions from './Task/tasks-actions'
import * as todolistsAsyncActions from './todolists-actions'
import {slice} from './todolists-reducer'

const todolistsActions = {
    todolistsAsyncActions,
    ...slice.actions
}

export {
    tasksActions,
    todolistsActions
}