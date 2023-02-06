import axios from "axios";
import {ResponseTodolistType, TodolistType} from "./types";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "25b09af8-ff36-4dd1-be5d-fb4aefde5c55"
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

// api

export const todolistsApi = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseTodolistType<{ item: TodolistType }>>('todo-lists', {title: title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseTodolistType>(`todo-lists/${id}`)
    },
    updateTodolist(title: string, id: string) {
        return instance.put<ResponseTodolistType>(`todo-lists/${id}`, {title: title})
    }
}
