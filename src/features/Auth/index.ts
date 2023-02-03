import { Login } from './Login'
import * as authSelectors from './selectors'
import {asyncActions, slice} from "./auth-reducer";
import {slice as authSlice} from "./auth-reducer";

const authReducer = authSlice.reducer

const authActions = {
    ...asyncActions,
    ...slice.actions
}

export {
    authSelectors,
    Login,
    authActions,
    authReducer
}