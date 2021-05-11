import React, {ChangeEvent, KeyboardEvent, useState} from "react";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeItemHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    const onClickAddItemHandler = () => {
        if (title.trim()) {
            props.addItem(title)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickAddItemHandler()
        }
    }

    return (
        <div>
            <input placeholder={'Add new item ...'} value={title} onChange={onChangeItemHandler}
                   onKeyPress={onKeyPressHandler} className={error ? 'error' : ''}
                   style={{outline: 'none'}}
            />
            <button onClick={onClickAddItemHandler}>+</button>
            {error ? <div className='error-message'>'Required title!'</div> : null}
        </div>
    )
}