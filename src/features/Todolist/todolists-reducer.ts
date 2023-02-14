import {FilterValueType} from "../../app/App";
import {todolistsApi} from "../../api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkErrorType} from "../../utils/types";
import {RequestStatusType} from "../Application/types";
import {TodolistType} from "../../api/types";
import {TodolistDomainType} from "./types";
import {appActions} from "../CommonActions";

const fetchTodolists = createAsyncThunk
('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await todolistsApi.getTodolists()
        thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {todolists: res.data}
    } catch (err: any) {
        handleServerNetworkError(err, thunkAPI)
        return thunkAPI.rejectWithValue(null)
    }
})
const removeTodolist = createAsyncThunk<{ todolistId: string }, string, ThunkErrorType>
('todolists/removeTodolists', async (id: string, {dispatch}) => {
    dispatch(changeTodolistEntityStatus({id: id, status: "loading"}))
    dispatch(appActions.setAppStatus({status: "loading"}))

    const res = await todolistsApi.deleteTodolist(id)

    dispatch(appActions.setAppStatus({status: "succeeded"}))
    return {todolistId: id}

    /*try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: id}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }*/
})
const changeTodolistTitle = createAsyncThunk
('todolists/changeTodolistTitle', async (param: { id: string, title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsApi.updateTodolist(param.title, param.id)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolistId: param.id, title: param.title}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (err: any) {
        return handleServerNetworkError(err, thunkAPI)
    }
})
const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkErrorType>
('todolists/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))

    try {
        const res = await todolistsApi.createTodolist(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: undefined}) // res.data.messages
        }
    } catch (err: any) {
        return handleServerNetworkError(err, thunkAPI)
    }
})

export const asyncActions = {
    fetchTodolists,
    removeTodolist,
    changeTodolistTitle,
    addTodolist,
}

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ value: FilterValueType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.value
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                if (index != -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                state[index].title = action.payload.title
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
            })
    }
})

export const {changeTodolistEntityStatus} = slice.actions


