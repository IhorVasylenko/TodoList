import React, {ChangeEvent, useState} from "react";

export type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title)

    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }

    const onChangeItemHandler = (e: ChangeEvent<HTMLInputElement>) =>  setTitle(e.currentTarget.value)

    return (
        editMode ?
            <input value={title} onChange={onChangeItemHandler} autoFocus onBlur={offEditMode} /> :
            <span onDoubleClick={onEditMode}>{props.title}</span>
    )
}