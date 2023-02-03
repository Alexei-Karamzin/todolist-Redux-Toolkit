import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../app/store";
import {AnyAction} from "redux";

export type AppDispatchType = ThunkDispatch<AppRootStateType, void, AnyAction>