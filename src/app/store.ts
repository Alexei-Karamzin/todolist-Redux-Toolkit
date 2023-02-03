import {combineReducers} from "redux";
import {tasksReducer, todolistsReducer} from "../features/Todolist";
import thunk from "redux-thunk";
import {authReducer} from "../features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import {FieldErrorType} from "../api/todolists-api";
import {appReducer} from "../features/App";

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

// types

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store

export type ThunkErrorType = {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}
