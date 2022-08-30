import {AnyAction, combineReducers} from "redux";
import {todolistsReducer} from "../features/Todolist/todolists-reducer";
import {tasksReducer} from "../features/Todolist/Task/tasks-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

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

export const useAppDispatch = () => useDispatch<AppDispatchType>()

// types

type AppDispatchType = ThunkDispatch<AppRootStateType, void, AnyAction>
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store