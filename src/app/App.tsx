import React, {useEffect, useState} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    createTheme,
    IconButton, Paper,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {TaskType} from "../api/tasks-api";
import {TodolistsList} from "../features/Todolist";
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from "../component/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {useAppDispatch} from "./store";
import {asyncActions} from "./app-reducer";
import {Route, Routes} from "react-router-dom";
import {Login} from '../features/Auth';
import {logout} from "../features/Auth/auth-reducer";
import {authSelectors} from "../features/Auth";
import {appSelectors} from "./index";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export type FilterValueType = 'all' | 'completed' | 'active'

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

export function App({demo = false}: PropsType) {

    const [darkMode, setDarkMode] = useState(false)

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    })
    const lightTheme = createTheme({
        palette: {
            mode: "light",
        },
    })
    const status = useSelector(appSelectors.selectStatus)
    const isInitialized = useSelector(appSelectors.selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(asyncActions.initializeApp())
        }
    }, [])

    if (!isInitialized) {
        return <div style={{position: "fixed", width: "100%", top: "30%", textAlign: "center"}}>
            <CircularProgress color="success"/>
        </div>
    }

    const logoutHandler = () => {
        dispatch(logout())
    }

    const changeModHandler = () => {
        setDarkMode(!darkMode)
    }

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Paper style={{height: "100vh"}}>
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
                            <IconButton sx={{ml: 1}} onClick={changeModHandler} color="inherit">
                                {darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                            </IconButton>
                            {isLoggedIn
                                ? <Button onClick={logoutHandler} color="inherit">Log out</Button>
                                : <>you are not registered in the system</>}
                        </Toolbar>
                        {status === 'loading' && <LinearProgress color="success"/>}
                    </AppBar>
                    <Container fixed>
                        <Routes>
                            <Route path={"todolist-Redux-Toolkit/"} element={<TodolistsList demo={demo}/>}/>
                            <Route path={"todolist-Redux-Toolkit/login"} element={<Login/>}/>
                        </Routes>
                    </Container>
                </div>
            </Paper>
        </ThemeProvider>
    );
}
