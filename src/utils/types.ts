import {ThunkDispatch} from "redux-thunk";
import {rootReducer} from "../app/store";
import {AnyAction} from "redux";
import {FieldErrorType} from "../api/todolists-api";

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = ThunkDispatch<AppRootStateType, void, AnyAction>

export type ThunkErrorType = {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}
