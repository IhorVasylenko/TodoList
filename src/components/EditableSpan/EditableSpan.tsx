import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";


export const EditableSpan: React.FC<EditableSpanPropsType> = (props) => {

    const {
        title,
        disabled,
        changeTitle,
    } = props;

    const [editMode, setEditMode] = useState<boolean>(false);
    const [displayedTitle, setDisplayedTitle] = useState(title);

    const onEditMode = () => setEditMode(true);
    const offEditMode = () => {
        setEditMode(false);
        changeTitle(displayedTitle);
    };

    const onChangeItemHandler = (e: ChangeEvent<HTMLInputElement>) =>  setDisplayedTitle(e.currentTarget.value);

    return (
        editMode ?
            <TextField
                variant={"standard"}
                color={"primary"}
                value={displayedTitle}
                onChange={onChangeItemHandler}
                autoFocus
                onBlur={offEditMode}
                disabled={disabled}
            /> :
            <span onDoubleClick={onEditMode}>{title}</span>
    );
};


// types
export type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
    disabled: boolean
};