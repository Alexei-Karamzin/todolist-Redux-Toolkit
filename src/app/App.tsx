import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, CircularProgress, Container, IconButton, Toolbar, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {TaskType} from "../api/tasks-api";
import {TodolistsList} from "../features/Todolist/TodolistsList";
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from "../component/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {useAppDispatch} from "./store";
import {initializeAppTC} from "./app-reducer";
import {Route, Routes} from "react-router-dom";
import {Login} from '../features/Auth/Login';
import {logoutTC} from "../features/Auth/auth-reducer";
import {authSelectors} from "../features/Auth";
import {appSelectors} from "./index";

export type FilterValueType = 'all' | 'completed' | 'active'

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

export function App({demo = false}: PropsType) {

    const status = useSelector(appSelectors.selectStatus)
    const isInitialized = useSelector(appSelectors.selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(initializeAppTC())
        }
    }, [])

    if (!isInitialized) {
        return <div style={{position: "fixed", width: "100%", top: "30%", textAlign: "center"}}>
            <CircularProgress color="success"/>
        </div>
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    {isLoggedIn
                        ? <Button onClick={logoutHandler} color="inherit">Log out</Button>
                        : <></>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color="success"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={"/"} element={<TodolistsList demo={demo}/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
            </Container>
        </div>
    );
}



