import React, {useEffect, useState} from 'react'
import {tasksApi} from "./tasks-api";

export default {
    title: 'API/tasksAPI'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todolistId = '5b5bfaeb-9a10-42b2-af0b-9305081c7efa'

        tasksApi.getTasks(todolistId)
            .then((response) => {
                setState(response.data)
            });

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todolistId = '5b5bfaeb-9a10-42b2-af0b-9305081c7efa'
        const taskId = '3de6fbc9-3e93-45b2-b95c-0b1bf851a4f8'

        tasksApi.deleteTask(todolistId, taskId)
            .then((response) => {
                setState(response.data)
            });

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todolistId = '5b5bfaeb-9a10-42b2-af0b-9305081c7efa'
        const title = '!!!!!!! NEW !!!!!!'

        tasksApi.createTask(todolistId, title)
            .then((response) => {
                setState(response.data)
            });

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todolistId = '5b5bfaeb-9a10-42b2-af0b-9305081c7efa'
        const taskId = 'f84f6828-c9d1-47e6-935b-9804499170f7'
        const model = {
            title: '___NEW___',
            description: '',
            status: 0,
            priority: 0,
            startDate: '',
            deadline: ''
        }

        tasksApi.updateTask(todolistId, taskId, model)
            .then((response) => {
                setState(response.data)
            });

    }, [])

    return <div> {JSON.stringify(state)}</div>
}