import {AppRootStateType, useActions} from "../../App/store";
import {useSelector} from "react-redux";
import {TodolistDomainType} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/tasks-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../component/AddItemForm/AddItemForm";
import {TodoList} from "./TodoList";
import {TaskStateType} from "../../App/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";
import {todolistsActions, tasksActions} from "./index";

type PropsType = {
    demo?: boolean
}

export const TodolistsList = ({demo = false}: PropsType) => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {removeTask, updateTask} = useActions(tasksActions)
    const {fetchTodolistsTC, addTodolist} = useActions(todolistsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolistsTC()
    }, [])

    const changeTaskTitle = useCallback((todolistId: string, taskId: string, title: string) => {
        updateTask({taskId, domainModel: {title}, todolistId})/*taskId, {title}, todolistId*/
    }, [])

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        updateTask({taskId, domainModel: {status}, todolistId})
    }, [])

    if(!isLoggedIn) {
        return <Navigate to='/login'/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={4}>
            {
                todolists.map((tl) => {
                    let tasksForTodolist = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper elevation={3} style={{padding: '10px'}}>
                            <TodoList
                                todolist={tl}
                                tasks={tasksForTodolist}
                                removeTask={removeTask}
                                changeStatus={changeTaskStatus}
                                changeTaskTitle={changeTaskTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}