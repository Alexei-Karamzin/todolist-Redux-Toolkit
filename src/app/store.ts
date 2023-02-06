import {combineReducers} from "redux";
import {tasksReducer, todolistsReducer} from "../features/Todolist";
import thunk from "redux-thunk";
import {authReducer} from "../features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "../features/Application";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

// @ts-ignore
window.store = store

