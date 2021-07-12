import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";


export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo ((props) => {

    const {
        addItem,
        disabled,
    } = props;

    const [title, setTitle] = useState('');
    const [error, setError] = useState<boolean>(false);

    const onClickAddItemHandler = () => {
        if (title.trim()) {
            addItem(title);
        } else {
            setError(true);
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
                disabled={disabled}
            />
            <IconButton color={error ? "secondary" : "primary"} onClick={onClickAddItemHandler} disabled={disabled}>
                <AddBox />
            </IconButton>
        </div>
    );
});


// types
export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
};