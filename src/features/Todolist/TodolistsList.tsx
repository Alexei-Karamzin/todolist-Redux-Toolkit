import {AppRootStateType, useActions} from "../../App/store";
import {useSelector} from "react-redux";
import {TodolistDomainType} from "./todolists-reducer";
import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import {AddItemForm} from "../../component/AddItemForm/AddItemForm";
import {TodoList} from "./TodoList";
import {TaskStateType} from "../../App/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";
import {todolistsActions} from "./index";

type PropsType = {
    demo?: boolean
}

export const TodolistsList = ({demo = false}: PropsType) => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {fetchTodolists, addTodolist} = useActions(todolistsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    if(!isLoggedIn) {
        return <Navigate to='/todolist-Redux-Toolkit/login'/>
    }

    const addTodolistCallback = async (title: string) => {
        addTodolist(title)
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={4} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
            {
                todolists.map((tl) => {
                    let tasksForTodolist = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <div style={{width: '310px'}}>
                            <TodoList
                                todolist={tl}
                                tasks={tasksForTodolist}
                                demo={demo}
                            />
                        </div>
                    </Grid>
                })
            }
        </Grid>
    </>
}