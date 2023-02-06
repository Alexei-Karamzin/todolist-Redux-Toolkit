import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import {EditableSpan} from "../../../component/EditableSpan/EditableSpan";
import RestoreFromTrashSharpIcon from "@mui/icons-material/RestoreFromTrashSharp";
import {TaskStatuses, TaskType} from "../../../api/types";
import {tasksActions} from "../index";
import {useActions} from "../../../utils/redux-utils";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = React.memo((props: TaskPropsType) => {

    const {updateTask, removeTask} = useActions(tasksActions)

    const onChangeTitleHandler = useCallback((title: string) => {
        updateTask({
            taskId: props.task.id,
            domainModel: {title},
            todolistId: props.todolistId,
        })
    }, [props.todolistId, props.task.id])

    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            taskId: props.task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
            todolistId: props.todolistId,
        })
    }, [props.todolistId, props.task.id])

    const removeTaskHandler = useCallback(() => removeTask({
        todolistId: props.todolistId,
        taskId: props.task.id
    }), [props.todolistId, props.task.id])

    return <div className={props.task.status === TaskStatuses.Completed ? 'isDone' : ''}
                key={props.task.id}
                style={{position: 'relative'}}
    >
        <Checkbox
            icon={<CheckCircleOutlineSharpIcon/>}
            checkedIcon={<CheckCircleSharpIcon/>}
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeStatusHandler}
        />
        <EditableSpan title={props.task.title} onChangeInputSpan={onChangeTitleHandler}/>
        <IconButton onClick={removeTaskHandler}
                    style={{position: 'absolute', top: '2px', right: '2px'}}>
            <RestoreFromTrashSharpIcon/>
        </IconButton>
    </div>
})