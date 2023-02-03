import {asyncActions as tasksAsyncActions} from './Task/tasks-reducer'
import {asyncActions as todolistsAsyncActions} from "./todolists-reducer";
import {slice as todolistsSlice} from './todolists-reducer'
import {slice as tasksSlice} from './Task/tasks-reducer'
import {TodolistsList} from './TodolistsList';

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions
}

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer

const tasksActions = {
    ...tasksAsyncActions,
}

export {
    tasksActions,
    todolistsActions,
    TodolistsList,
    todolistsReducer,
    tasksReducer
}