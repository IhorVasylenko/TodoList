import React, {useCallback} from "react";
import {FilterValuesType, TasksType} from "./App";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";

export type TodoListPropsType = {
    todoListId: string,
    title: string,
    tasks: Array<TasksType>,
    filter: FilterValuesType,
    addTask: (title: string, todoListId: string) => void,
    removeTask: (taskId: string, todoListId: string) => void,
    changeFilter: (value: FilterValuesType, todoListId: string) => void,
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean, todoListId: string) => void,
    removeTodoList: (todoListId: string) => void,
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void,
    changeTodoListTitle: (title: string, todoListId: string) => void,
};

export const TodoList = React.memo((
    {
        changeTaskTitle,
        changeTaskStatus,
        changeTodoListTitle,
        todoListId,
        removeTodoList,
        removeTask,
        title,
        changeFilter,
        tasks,
        addTask,
        filter,
    }: TodoListPropsType) => {

    const getTaskForTodoList = () => {
        switch (filter) {
            case "active":
                return tasks.filter(task => !task.isDone);
            case "completed":
                return tasks.filter(task => task.isDone);
            default:
                return tasks;
        }
    };

    let tasksForTodoList = getTaskForTodoList();
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t => !t.isDone)
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.isDone)
    }

    const tasksList = tasksForTodoList.map(task => <Task
        changeTaskStatus={changeTaskStatus}
        changeTaskTitle={changeTaskTitle}
        removeTask={removeTask}
        todoListId={todoListId}
        task={task}
        key={task.id}
    />);

    const onClickRemoveTodoListHandler = useCallback(
        () => removeTodoList(todoListId),
        [removeTodoList, todoListId]);
    const addTaskFn = useCallback((title: string) => addTask(title, todoListId),
        [addTask, todoListId]);
    const changeTodoListTitleFn = useCallback(
        (title: string) => changeTodoListTitle(title, todoListId),
        [changeTodoListTitle, todoListId]);
    const onClickAllChangeFilterHandler = useCallback(
        () => changeFilter('all', todoListId),
        [changeFilter, todoListId]);
    const onClickActiveChangeFilterHandler = useCallback(
        () => changeFilter('active', todoListId),
        [changeFilter, todoListId]);
    const onClickCompletedChangeFilterHandler = useCallback(
        () => changeFilter('completed', todoListId),
        [changeFilter, todoListId]);


    return (
        <div>
            <h3 >
                <EditableSpan title={title} changeTitle={changeTodoListTitleFn} />
                <IconButton onClick={onClickRemoveTodoListHandler}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskFn} />
            <div>{tasksList}</div>
            <div>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    color={filter === 'all' ? 'primary' : 'default'}
                    onClick={onClickAllChangeFilterHandler}>All</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === 'active' ? 'contained' : 'outlined'}
                    color={filter === 'active' ? 'primary' : 'default'}
                    onClick={onClickActiveChangeFilterHandler}>Active</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === 'completed' ? 'contained' : 'outlined'}
                    color={filter === 'completed' ? 'primary' : 'default'}
                    onClick={onClickCompletedChangeFilterHandler}>Completed</Button>
            </div>
        </div>
    );
})


