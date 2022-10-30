import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../App/app-reducer";
import {todolistsApi} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (param, {
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

export const removeTodolist = createAsyncThunk('todolists/removeTodolists', async (id: string, {
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

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistsTitle', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
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

export const addTodolist = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
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