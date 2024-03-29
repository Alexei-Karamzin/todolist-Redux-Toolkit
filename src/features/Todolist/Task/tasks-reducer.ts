import {TaskStateType} from "../../../app/App";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {tasksApi} from "../../../api/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AppRootStateType, ThunkErrorType} from "../../../utils/types";
import {asyncActions as asyncTodolistsActions} from '../todolists-reducer'
import {TaskType, UpdateTaskModelType} from "../../../api/types";
import {UpdateDomainTaskModelType} from "./type";
import {appActions} from "../../CommonActions";

const initialState: TaskStateType = {}

const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkErrorType>
('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    const res = await tasksApi.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
    return {tasks, todolistId}
})
const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }, ThunkErrorType>
('tasks/removeTasks', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    const res = await tasksApi.deleteTask(param.todolistId, param.taskId)
    thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
    return {taskId: param.taskId, todolistId: param.todolistId}
})
const addTask = createAsyncThunk<TaskType, { title: string, todolistId: string }, ThunkErrorType>
('tasks/addTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await tasksApi.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: undefined}) // !! fieldsErrors
        }
    } catch (err: any) {
        return handleServerNetworkError(err, thunkAPI)
        //rejectWithValue({errors: [err.message], fieldsErrors: undefined}
    }
})
const updateTask = createAsyncThunk
('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, {
    dispatch,
    rejectWithValue,
    getState
}) => {
    //dispatch(setAppStatusAC({status: 'loading'}))

    const state = getState() as AppRootStateType

    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (!task) {
        return rejectWithValue('task not found in the state')
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        ...param.domainModel
    }

    const res = await tasksApi.updateTask(param.todolistId, param.taskId, apiModel)

    try {
        if (res.data.resultCode === 0) {
            return param
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue(null)
    }
})

export const asyncActions = {fetchTasks, removeTask, addTask, updateTask}

export const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(asyncTodolistsActions.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(asyncTodolistsActions.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                if (index != -1) {
                    state[action.payload.todolistId].splice(index, 1)
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
    }
})
