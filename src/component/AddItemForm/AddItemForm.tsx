import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

type addItemFormPropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: addItemFormPropsType) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onKeyPressHandler = (e: KeyboardEvent<HTMLDivElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addTaskOnClickHandler()
        }
    }

    const onChangeInputHandler = (newTitle: ChangeEvent<HTMLInputElement>) => {
        setTitle(newTitle.currentTarget.value)
    }

    const addTaskOnClickHandler = async () => {
        if (title.trim() !== '') {
            try {
                await addItem(title.trim())
                setTitle('')
            } catch(err: any) {
                setError('')
            }
        } else {
            setError('error')
        }
    }

    return <div>
        <TextField disabled={disabled}
                   label={'text'}
                   value={title}
                   variant="outlined"
                   onKeyPress={onKeyPressHandler}
                   onChange={onChangeInputHandler}
                   error={!!error}
                   helperText={error}
        />

        <IconButton onClick={addTaskOnClickHandler} disabled={disabled} style={{marginLeft: '5px'}}>
            <AddBoxIcon/>
        </IconButton>
    </div>
})