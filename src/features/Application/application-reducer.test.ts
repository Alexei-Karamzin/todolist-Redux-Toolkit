import { appActions } from "../CommonActions";
import { appReducer } from "./index";
import {InitialStateType} from "./types";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: true
    }
})

test('correct error message should be set', ()=>{
    const endState = appReducer(startState, appActions.setAppError({error: 'some error'}))
    expect(endState.error).toBe('some error')
})

test('correct status should be set', ()=>{
    const endState = appReducer(startState, appActions.setAppStatus({status: 'loading'}))
    expect(endState.status).toBe('loading')
})