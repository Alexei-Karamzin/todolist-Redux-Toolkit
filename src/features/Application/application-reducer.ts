import {authApi} from "../../api/auth-api";
import {authActions} from "../Auth";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {InitialStateType, RequestStatusType} from "./types";
import {appActions} from "../CommonActions";

export const initializeApp = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({value: true}))
    } else {

    }
})

export const asyncActions = {initializeApp}

export const slice = createSlice({
    name: 'app',
    initialState: {
        // происходит ли взаимодействие с сервером
        status: 'idle' as RequestStatusType,
        // если есть ошибка текст ошибки записывается сюда
        error: null as null | string,
        // true когда проинициализировалось приложение
        isInitialized: false
    } as InitialStateType,
    reducers: {
        /*setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }*/
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
        builder.addCase(appActions.setAppError, (state, action) => {
            state.error = action.payload.error
        })
        builder.addCase(appActions.setAppStatus, (state, action) => {
            state.status = action.payload.status
        })
    }
})



