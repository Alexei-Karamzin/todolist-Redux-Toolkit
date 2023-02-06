import {setAppErrorAC, setAppStatusAC} from "../features/Application/application-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'ERROR'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (err: {message: string}, thunkAPI: any) => {
    thunkAPI.dispatch(setAppErrorAC({error: err.message ? err.message : 'ERROR'}))
    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
}