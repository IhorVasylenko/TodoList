import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
};

export const AddItemForm = React.memo ((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<boolean>(false);

    const onClickAddItemHandler = () => {
        if (title.trim()) {
            props.addItem(title)
        } else {
            setError(true)
        }
        setTitle('');
    };

    const onChangeItemHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        setError(false);
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickAddItemHandler();
        }
    };

    return (
        <div>
            <TextField
                size={"small"}
                label={"Add new task ..."}
                helperText={error && "Required title!"}
                error={error}
                variant={"outlined"}
                value={title}
                onChange={onChangeItemHandler}
                onKeyPress={onKeyPressHandler}
            />
            <IconButton color={error ? "secondary" : "primary"} onClick={onClickAddItemHandler}>
                <AddBox/>
            </IconButton>
        </div>
    );
})