import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

type addItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: addItemFormPropsType) => {

    console.log('AddItemForm call')

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

    const addTaskOnClickHandler = () => {
        if (title.trim() !== '') {
            addItem(title.trim())
            setTitle('')
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