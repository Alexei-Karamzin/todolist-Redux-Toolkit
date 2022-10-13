import {FilterValueType} from "../../App/App";
import {todolistsApi, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: "loading"}))

    const res = await todolistsApi.getTodolists()

    try {
        dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolists: res.data}
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolists', async (id: string, {dispatch,rejectWithValue}) => {
    //dispatch(changeTodolistEntityStatusAC({id: id, status: "loading"}))
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

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistsTitle', async (param: {id: string, title: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistsApi.updateTodolist(param.title, param.id)

        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: param.id, title: param.title}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: "loading"}))

    const res = await todolistsApi.createTodolist(title)

    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        /*addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        },*/
        changeTodolistFilterAC(state, action: PayloadAction<{ value: FilterValueType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.value
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status

        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index != -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        })
        builder.addCase(addTodolistTC.fulfilled,(state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions

//types

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}