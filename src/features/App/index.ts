import * as appSelectors from '../../app/selectors'
import {slice as appSlice} from './app-reducer'

const appReducer = appSlice.reducer

const appActions = appSlice.actions

export {
    appSelectors,
    appReducer,
    appActions,
}