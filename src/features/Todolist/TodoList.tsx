import React, {useCallback, useEffect} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../component/AddItemForm/AddItemForm";
import {EditableSpan} from "../../component/EditableSpan/EditableSpan";
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {Button} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../api/tasks-api";
import {useActions, useAppDispatch} from "../../App/store";
import {TodolistDomainType} from "./todolists-reducer";
import {tasksActions, todolistsActions} from "./index";
import {FilterValueType} from "../../App/App";
import {Paper} from "@mui/material";

type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const TodoList = React.memo(({demo = false, ...props}: TodolistPropsType) => {

    const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
    const {addTask, fetchTasks} = useActions(tasksActions)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])

    const removeTodolistHandler = (todolistId: string) => {
        removeTodolist(todolistId)
    }

    const addTaskTitle = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        let thunk = addTask({todolistId: props.todolist.id, title: title})
        const resultAction = await dispatch(thunk)

        if (addTask.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                helper.setError(resultAction.payload?.errors[0])
            } else {
                helper.setError("Some error occured")
            }
        } else {
            helper.setTitle('')
        }
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

    const renderFilterButton = (buttonFilter: FilterValueType,
                                color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
                                text: string) => {
        return <Button
            color={color}
            variant={props.todolist.filter === buttonFilter ? "contained" : "outlined"}
            onClick={() => changeTodolistFilter({todolistId: props.todolist.id, value: buttonFilter})}
        >{text}
        </Button>
    }

    return (
        <Paper style={{position: "relative", padding: '10px'}}>
            <IconButton onClick={() => removeTodolistHandler(props.todolist.id)}
                        style={{position: "absolute", right: '5px', top: '5px'}}
                        disabled={props.todolist.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
            <h3>
                <EditableSpan title={props.todolist.title} onChangeInputSpan={onChangeTitleHandler}/>
            </h3>
            <AddItemForm addItem={addTaskTitle} disabled={props.todolist.entityStatus === "loading"}/>
            <div>
                {
                    taskForTodolist.map((el) => <Task
                        key={el.id}
                        task={el}
                        todolistId={props.todolist.id}
                    />)
                }
                {!taskForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No task</div>}
            </div>
            <div>
                {renderFilterButton("all", "secondary", 'All')}
                {renderFilterButton("active", "success", 'Active')}
                {renderFilterButton("completed", "error", 'Completed')}
            </div>
        </Paper>
    )
})

// react-scripts --openssl-legacy-provider start