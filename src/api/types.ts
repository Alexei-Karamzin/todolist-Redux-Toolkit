
export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: string
}

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Graft
}
export enum TaskPriority {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}
export type TaskType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriority
    startDate: string
    deadline: string
    addedDate: string
}
export type ResponseTaskType<D = {}> = {
    resultCode: number,
    messages: string[],
    data: D
}
export type GetTasksResponse = {
    items: Array<TaskType>
    totalCount: number
    error: string
}
export type CreateUpdateTaskType = {
    item: TaskType
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type ResponseTodolistType<D = {}> = {
    resultCode: number,
    messages: string[],
    fieldsErrors?: Array<FieldErrorType>
    data: D
}
export type FieldErrorType = {
    field: string,
    error: string
}