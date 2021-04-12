import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType, TasksType} from "./App";

type TodoListPropsType = {
    title: string
    tasks: Array<TasksType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
}

export function TodoList (props: TodoListPropsType) {
    const [title, setTitle] = useState('')

    const tasksArray = props.tasks.map(task => {
            const removeTask = () => {
                props.removeTask(task.id)
            }

            return <li key={task.id}>
                <input type="checkbox" checked={task.isDone}/>
                <span>{task.title}</span>
                <button onClick={removeTask}>x
                </button>
            </li>
        }
    )

    const onClickAddTaskHandler = () => {
        props.addTask(title)
        setTitle('')
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onClickAddTaskHandler()
        }
    }

    const onClickAllChangeFilterHandler = () => {props.changeFilter('all')}
    const onClickActiveChangeFilterHandler = () => {props.changeFilter('active')}
    const onClickCompletedChangeFilterHandler = () => {props.changeFilter('completed')}

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input placeholder={'Add new task...'} value={title} onChange={onChangeTitleHandler} onKeyPress={onKeyPressHandler}/>
                <button onClick={onClickAddTaskHandler}>+</button>
            </div>
            <ul>
                {tasksArray}
            </ul>
            <div>
                <button onClick={onClickAllChangeFilterHandler}>All</button>
                <button onClick={onClickActiveChangeFilterHandler}>Active</button>
                <button onClick={onClickCompletedChangeFilterHandler}>Completed</button>
            </div>
        </div>
    )
}