import {FilterValueType} from "../../App/App";
import {todolistsApi, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
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

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolists', async (id: string, {
    dispatch,
    rejectWithValue
}) => {
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

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsApi.updateTodolist(title, id)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({todolistId: id, title: title}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
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
    }
})

export const todolistsReducer = slice.reducer
export const {
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions

//types

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}