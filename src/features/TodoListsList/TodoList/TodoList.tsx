import React, {useCallback, useEffect} from "react";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {Button, IconButton} from "@material-ui/core";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todoListAPI";
import {FilterValuesType, TodoListDomainType} from "../todoListsReducer";
import {useDispatch} from "react-redux";
import {fetchTask, TaskDomainType} from "../tasksReducer";
import {Dispatch} from "redux";
import {DeleteForever} from "@material-ui/icons";


export const TodoList: React.FC<TodoListPropsType> = React.memo((props) => {

    const {
        todoList,
        changeTaskTitle,
        changeTaskStatus,
        changeTodoListTitle,
        removeTodoList,
        removeTask,
        changeFilter,
        tasks,
        addTask,
        demo = false,
    } = props;

    const {
        id,
        title,
        filter,
        entityStatus,
    } = todoList;

    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
        if (demo) {
            return;
        }
        dispatch(fetchTask(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTaskForTodoList = () => {
        switch (filter) {
            case "active":
                return tasks.filter(task => task.status === TaskStatuses.New);
            case "completed":
                return tasks.filter(task => task.status === TaskStatuses.Completed);
            default:
                return tasks;
        }
    };

    let tasksForTodoList = getTaskForTodoList();
    if (filter === "active") {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const tasksList = tasksForTodoList.map((t: TaskDomainType) => <Task
        changeTaskStatus={changeTaskStatus}
        changeTaskTitle={changeTaskTitle}
        removeTask={removeTask}
        todoListId={id}
        task={t}
        key={t.id}
    />);

    const onClickRemoveTodoListHandler = useCallback(
        () => removeTodoList(id),
        [removeTodoList, id]);
    const addTaskFn = useCallback((title: string) => addTask(title, id),
        [addTask, id]);
    const changeTodoListTitleFn = useCallback(
        (title: string) => changeTodoListTitle(id, title),
        [changeTodoListTitle, id]);
    const onClickAllChangeFilterHandler = useCallback(
        () => changeFilter(id, "all"),
        [changeFilter, id]);
    const onClickActiveChangeFilterHandler = useCallback(
        () => changeFilter(id, "active"),
        [changeFilter, id]);
    const onClickCompletedChangeFilterHandler = useCallback(
        () => changeFilter(id, "completed"),
        [changeFilter, id]);


    return (
        <div>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodoListTitleFn} disabled={entityStatus === "loading"}/>
                <IconButton
                    onClick={onClickRemoveTodoListHandler}
                    color={"secondary"}
                    size={"medium"}
                    disabled={entityStatus === "loading"}>
                    <DeleteForever/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskFn} disabled={entityStatus === "loading"}/>
            <div>{tasksList}</div>
            <div>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === "all" ? "contained" : "outlined"}
                    color={filter === "all" ? "default" : "default"}
                    onClick={onClickAllChangeFilterHandler}>All</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === "active" ? "contained" : "outlined"}
                    color={filter === "active" ? "primary" : "default"}
                    onClick={onClickActiveChangeFilterHandler}>Active</Button>
                <Button
                    style={{margin: "3px"}}
                    size={"small"}
                    variant={filter === "completed" ? "contained" : "outlined"}
                    color={filter === "completed" ? "primary" : "default"}
                    onClick={onClickCompletedChangeFilterHandler}>Completed</Button>
            </div>
        </div>
    );
});


// types
export type TodoListPropsType = {
    todoList: TodoListDomainType
    tasks: TaskDomainType[]
    addTask: (title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (todoListId: string, filter: FilterValuesType) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, title: string) => void
    demo?: boolean
};


