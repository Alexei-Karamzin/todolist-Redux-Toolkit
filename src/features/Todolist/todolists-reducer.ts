import {FilterValueType} from "../../app/App";
import {todolistsApi, TodolistType} from "../../api/todolists-api";
import {appActions} from "../Application";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkErrorType} from "../../utils/types";
import {RequestStatusType} from "../Application/application-reducer";

const {setAppStatusAC} = appActions

const fetchTodolists = createAsyncThunk('todolists/fetchTodolists',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))

    const res = await todolistsApi.getTodolists()

    try {
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolists: res.data}
    } catch (err: any) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

const removeTodolist = createAsyncThunk('todolists/removeTodolists', async (id: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(changeTodolistEntityStatus({id: id, status: "loading"}))
    dispatch(setAppStatusAC({status: "loading"}))

    const res = await todolistsApi.deleteTodolist(id)

    dispatch(setAppStatusAC({status: "succeeded"}))
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

const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle',
    async (param: { id: string, title: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsApi.updateTodolist(param.title, param.id)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: param.id, title: param.title}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (err: any) {
        return handleServerNetworkError(err, thunkAPI)
    }
})

const addTodolist = createAsyncThunk<{todolist: TodolistType}, string, ThunkErrorType>
('todolists/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))

    try {
        const res = await todolistsApi.createTodolist(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
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
    addTodolist
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
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        })
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index != -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        })
        builder.addCase(addTodolist.fulfilled,(state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        })
    }
})

export const {
    changeTodolistFilter,
    changeTodolistEntityStatus
} = slice.actions

//types

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}