import axios from "axios";
import {ResponseTodolistType} from "./types";
import { LoginParamsType } from "./types";

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

export const authApi = {
    login(data: LoginParamsType) {
        return instance.post<ResponseTodolistType<{userId?: number}>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseTodolistType<{userId?: number}>>('auth/login')
    },
    me() {
        return instance.get<ResponseTodolistType<{id: number, email: string, login: string}>>('auth/me')
    }
}

