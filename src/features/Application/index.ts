import * as appSelectors from '../../app/selectors'
import {asyncActions, slice as appSlice} from './application-reducer'

const appReducer = appSlice.reducer
const action = appSlice.actions

const appActions = {
    ...action,
    ...asyncActions,
}

export {
    appSelectors,
    appReducer,
    appActions,
}