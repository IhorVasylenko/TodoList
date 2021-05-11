import React, {ChangeEvent} from "react";
import {FilterValuesType, TasksType} from "./App";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";

type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: Array<TasksType>
    filter: FilterValuesType
    addTask: (title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export function TodoList(props: TodoListPropsType) {

    const tasksList = props.tasks.map(task => {
            const removeTask = () => props.removeTask(task.id, props.todoListId)
            const onChengStatusHandler = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(task.id, e.currentTarget.checked, props.todoListId)
            const changeTaskTitle = (title: string) => props.changeTaskTitle(task.id, title, props.todoListId)

            return (
                <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                    <input type="checkbox" checked={task.isDone}
                           onChange={onChengStatusHandler} />
                    <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                    <button onClick={removeTask}>x</button>
                </li>
            )
        }
    )

    const onClickRemoveTodoListHandler = () => props.removeTodoList(props.todoListId)

    const onClickAllChangeFilterHandler = () => props.changeFilter('all', props.todoListId)
    const onClickActiveChangeFilterHandler = () => props.changeFilter('active', props.todoListId)
    const onClickCompletedChangeFilterHandler = () => props.changeFilter('completed', props.todoListId)

    const addTask = (title: string) => props.addTask(title, props.todoListId)

    const changeTodoListTitle = (title: string) => props.changeTodoListTitle(title, props.todoListId)

    return (
        <div>
            <h3 >
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle} />
                <button onClick={onClickRemoveTodoListHandler}>x</button>
            </h3>
            <AddItemForm addItem={addTask} />
            <ul>{tasksList}</ul>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onClickAllChangeFilterHandler}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onClickActiveChangeFilterHandler}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''} onClick={onClickCompletedChangeFilterHandler}>Completed</button>
            </div>
        </div>
    )
}