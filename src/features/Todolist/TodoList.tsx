import React, {useCallback, useEffect} from "react";
import {FilterValueType} from "../../App/App";
import {AddItemForm} from "../../component/AddItemForm/AddItemForm";
import {EditableSpan} from "../../component/EditableSpan/EditableSpan";
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {Button} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../api/tasks-api";
import {useActions, useAppDispatch} from "../../App/store";
import {TodolistDomainType} from "./todolists-reducer";
import {fetchTasks} from "./Task/tasks-actions";
import {tasksActions, todolistsActions} from "./index";

type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    removeTask: (params: { todolistId: string, taskId: string }) => void
    changeStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    demo?: boolean
}

export const TodoList = React.memo(({demo = false, ...props}: TodolistPropsType) => {

    const dispatch = useAppDispatch()

    const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
    const {addTask} = useActions(tasksActions)

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasks(props.todolist.id))
    }, [])

    const onChangeCheckboxHandler = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        props.changeStatus(taskId, status, todolistId)
    }, [props.changeStatus])

    const removeTodolistHandler = (todolistId: string) => {
        removeTodolist(todolistId)
    }

    const addTaskCallback = useCallback((title: string) => {
        addTask({todolistId: props.todolist.id, title: title})
    }, [props.todolist.id])

    const onChangeTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title: title})
    }, [props.todolist.id])

    let taskForTodolist = props.tasks
    if (props.todolist.filter === 'completed') {
        taskForTodolist = props.tasks.filter(task => task.status === TaskStatuses.Completed)
    }
    if (props.todolist.filter === 'active') {
        taskForTodolist = props.tasks.filter(task => task.status === TaskStatuses.New)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.todolist.title} onChangeInputSpan={onChangeTitleHandler}/>
                <IconButton
                    onClick={() => removeTodolistHandler(props.todolist.id)}
                    disabled={props.todolist.entityStatus === "loading"}
                >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"}/>
            <div>
                {
                    taskForTodolist.map((el) => <Task
                        key={el.id}
                        task={el}
                        removeTask={props.removeTask}
                        todolistId={props.todolist.id}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={onChangeCheckboxHandler}
                    />)
                }
            </div>
            <div>
                <Button
                    color={"secondary"}
                    variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                    onClick={() => changeTodolistFilter({todolistId: props.todolist.id, value: "all"})}
                >All
                </Button>
                <Button
                    color={"success"}
                    variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                    onClick={() => changeTodolistFilter({todolistId: props.todolist.id, value: "active"})}
                >Active
                </Button>
                <Button
                    color={"error"}
                    variant={props.todolist.filter === "completed" ? "contained" : "outlined"}
                    onClick={() => changeTodolistFilter({todolistId: props.todolist.id, value: "completed"})}
                >Completed
                </Button>
            </div>
        </div>
    )
})


// react-scripts --openssl-legacy-provider start