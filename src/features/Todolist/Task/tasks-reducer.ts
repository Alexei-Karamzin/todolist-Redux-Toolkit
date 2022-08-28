import {TaskStateType} from "../../../App/App";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistAC
} from "../todolists-reducer";
import {tasksApi, TaskType, UpdateTaskModelType} from "../../../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../App/store";
import {
    setAppStatusAC
} from "../../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (index != -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index != -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTaskAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(setTodolistAC, (state, action) => {
            action.payload.todolists.forEach( tl => {
                state[tl.id] = []
            })
        })
    }
})

export const tasksReducer = slice.reducer
export const {
    addTaskAC,
    removeTaskAC,
    updateTaskAC,
    setTaskAC
} = slice.actions

// thunks

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    tasksApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC({tasks: res.data.items, todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    tasksApi.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(removeTaskAC({taskId, todolistId}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    tasksApi.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const changeTaskTitleTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.log('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        ...domainModel
    }
    tasksApi.updateTask(todolistId, taskId, apiModel)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC({taskId, todolistId, model: domainModel}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const changeTaskStatusTC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.log('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        ...model
    }

    tasksApi.updateTask(todolistId, taskId, apiModel)
        .then(res => {
            dispatch(updateTaskAC({taskId, model, todolistId}))
        })
}

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}