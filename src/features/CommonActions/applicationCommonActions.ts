import {createAction} from "@reduxjs/toolkit";
import {RequestStatusType} from "../Application/types";

const setAppStatus = createAction<{ status: RequestStatusType }>('app/setAppStatus')
const setAppError = createAction<{ error: null | string }>('app/setAppError')

export const appActions = {
    setAppStatus,
    setAppError,
}