import React from "react";
import {FilterValuesType, TasksType} from "./App";

type TodoListPropsType = {
    title: string
    tasks: Array<TasksType>
    removeTask: (taskId: number) => void //типизация функции без return
    changeFilter: (value: FilterValuesType) => void
}

export function TodoList (props: TodoListPropsType) {
    const tasks = props.tasks.map(task => <li>
        <input type="checkbox" checked={task.isDone}/>
        <span>{task.title}</span>
        <button onClick={() => {props.removeTask(task.id)}}>x</button>
    </li>)

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {tasks}
            </ul>
            <div>
                <button onClick={() => {props.changeFilter('all')}}>All</button>
                <button onClick={() => {props.changeFilter('active')}}>Active</button>
                <button onClick={() => {props.changeFilter('completed')}}>Completed</button>
            </div>
        </div>
    )
}