import {TaskStateType} from "../../../App/App";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistActionType
} from "../todolists-reducer";
import {tasksApi,TaskType, UpdateTaskModelType} from "../../../api/tasks-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../App/store";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";

const initialState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter( t => t.id !== action.taskId)}
        case 'UPDATE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].map( t => t.id === action.taskId ? {...t, ...action.model} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const stateCope = {...state}
            delete stateCope[action.todolistId]
            return stateCope
        case "SET-TODOLIST":
            const copyState = {...state}
            return action.todolists.reduce((acc, tl) => {
                copyState[tl.id] = []
                return copyState
            }, {...state})
        case "SET-TASKS":
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        default:
            return state
    }
}

// actions

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const removeTaskAC = (todolistId: string, taskId: string) =>
    ({
    type: 'REMOVE-TASK',
    taskId,
    todolistId
} as const)
export const updateTaskAC = (taskId:string, model:UpdateDomainTaskModelType, todolistId: string) =>
    ({
    type: 'UPDATE-TASK',
    taskId,
    model,
    todolistId
} as const)
export const setTaskAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({
    type: 'SET-TASKS',
    tasks,
    todolistId
} as const)

// thunks

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC(res.data.items, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(removeTaskAC(todolistId, taskId))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const changeTaskTitleTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
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
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const changeTaskStatusTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
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
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
        })
}

// types

type ActionType =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof setTaskAC>
    | SetAppErrorActionType
    | SetAppStatusActionType

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}