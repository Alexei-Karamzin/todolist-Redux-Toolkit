import React from 'react'
import { Provider } from 'react-redux'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import { v1 } from 'uuid'
import { AppRootStateType} from "./store";
import { tasksReducer } from '../features/Todolist/Task/tasks-reducer'
import { todolistsReducer } from '../features/Todolist/todolists-reducer'
import {TaskPriority} from "../api/tasks-api";
import {appReducer} from "./app-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: "idle"},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', order: 0, addedDate: '', entityStatus: "loading"}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'HTML&CSS', description: '', todoListId: 'todolistId1', order: 0, status: 1, priority: TaskPriority.Low,startDate: '', deadline: '', addedDate: ''},
            {id: v1(), title: 'JS', description: '', todoListId: 'todolistId1', order: 0, status: 1, priority: TaskPriority.Low,startDate: '', deadline: '', addedDate: ''}
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Beer', description: '', todoListId: 'todolistId1', order: 0, status: 1, priority: TaskPriority.Low,startDate: '', deadline: '', addedDate: ''},
            {id: v1(), title: 'React Book', description: '', todoListId: 'todolistId1', order: 0, status: 1, priority: TaskPriority.Low,startDate: '', deadline: '', addedDate: ''},
        ]
    },
    app: {
        error: null,
        status: 'idle',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk))

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>)

/*
export const ReduxStoreProviderDecorator = (StoryFC: any/!*() => React.ReactNode*!/) => {
    return <Provider store={store}>
        {StoryFC()}
    </Provider>
}*/
