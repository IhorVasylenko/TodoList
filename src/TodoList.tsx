import React, {ChangeEvent} from "react";
import {FilterValuesType, TasksType} from "./App";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

export type TodoListPropsType = {
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
                <div key={task.id} >
                    <Checkbox
                        color={"default"}
                        checked={task.isDone}
                        onChange={onChengStatusHandler}
                    />
                    <span className={task.isDone ? 'is-done' : ''}>
                    <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                    </span>
                    <IconButton onClick={removeTask} style={{opacity: ".7"}}>
                        <Delete/>
                    </IconButton>
                </div>
            )
        }
    )

    const onClickRemoveTodoListHandler = () => props.removeTodoList(props.todoListId)
    const addTask = (title: string) => props.addTask(title, props.todoListId)
    const changeTodoListTitle = (title: string) => props.changeTodoListTitle(title, props.todoListId)

    const onClickAllChangeFilterHandler = () => props.changeFilter('all', props.todoListId)
    const onClickActiveChangeFilterHandler = () => props.changeFilter('active', props.todoListId)
    const onClickCompletedChangeFilterHandler = () => props.changeFilter('completed', props.todoListId)


    return (
        <div>
            <h3 >
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle} />
                <IconButton onClick={onClickRemoveTodoListHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} />
            <div>{tasksList}</div>
            <div>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={props.filter === 'all' ? 'contained' : 'outlined'}
                    color={props.filter === 'all' ? 'primary' : 'default'}
                    onClick={onClickAllChangeFilterHandler}>All</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={props.filter === 'active' ? 'contained' : 'outlined'}
                    color={props.filter === 'active' ? 'primary' : 'default'}
                    onClick={onClickActiveChangeFilterHandler}>Active</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={props.filter === 'completed' ? 'contained' : 'outlined'}
                    color={props.filter === 'completed' ? 'primary' : 'default'}
                    onClick={onClickCompletedChangeFilterHandler}>Completed</Button>
            </div>
        </div>
    )
}