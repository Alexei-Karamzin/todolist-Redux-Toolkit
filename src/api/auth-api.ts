import axios from "axios";
import {ResponseType} from "./todolists-api";
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
        return instance.post<ResponseType<{userId?: number}>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType<{userId?: number}>>('auth/login')
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me')
    }
}

