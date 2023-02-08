import {appActions} from "../features/CommonActions/applicationCommonActions";
import {ResponseTodolistType} from "../api/types";
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseTodolistType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: 'ERROR'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (err: {message: string}, thunkAPI: any) => {
    thunkAPI.dispatch(appActions.setAppError({error: err.message ? err.message : 'ERROR'}))
    thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
}