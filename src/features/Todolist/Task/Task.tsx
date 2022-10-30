import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import {EditableSpan} from "../../../component/EditableSpan/EditableSpan";
import RestoreFromTrashSharpIcon from "@mui/icons-material/RestoreFromTrashSharp";
import {TaskStatuses, TaskType} from "../../../api/tasks-api";

type TaskPropsType = {
    task: TaskType
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    removeTask: (params: {todolistId: string, taskId: string}) => void
    todolistId: string
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {

    const onChangeTitleHandler = useCallback((title: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, title)
    },[props.changeTaskTitle,props.todolistId,props.task.id])

    const onChangeStatusHandler = (e:ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId)
    }

    const removeTaskHandler = () => props.removeTask({todolistId: props.todolistId, taskId: props.task.id})

    return <div className={props.task.status === TaskStatuses.Completed ? 'isDone' : ''} key={props.task.id}>
        <Checkbox
            icon={<CheckCircleOutlineSharpIcon/>}
            checkedIcon={<CheckCircleSharpIcon/>}
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeStatusHandler}
        />
        <EditableSpan title={props.task.title} onChangeInputSpan={onChangeTitleHandler}/>
        <IconButton onClick={removeTaskHandler}>
            <RestoreFromTrashSharpIcon/>
        </IconButton>
    </div>
})