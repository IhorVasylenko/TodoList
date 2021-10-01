import React, {useCallback, useEffect} from "react";
import {Button, IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todoList-API";
import {useActions, useAppDispatch} from "../../../app/store";
import {TodoListDomainType} from "../reducers/todoLists-reducer";
import {TaskDomainType} from "../reducers/tasks-reducer";
import {tasksActions, todoListsActions} from "../index";


export const TodoList: React.FC<TodoListPropsType> = React.memo((props) => {

    const {
        todoList,
        tasks,
        demo,
    } = props;

    const {
        id,
        title,
        filter,
        entityStatus,
    } = todoList;

    const {changeTodoListFilter, removeTodoList, changeTodoListTitle} = useActions(todoListsActions);
    const {addTask, fetchTask, removeTask, modernizeTask} = useActions(tasksActions);

    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTask(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        modernizeTask({todoListId, taskId, model: {status}});
    }, [modernizeTask]);
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        modernizeTask({todoListId, taskId, model: {title}});
    }, [modernizeTask]);

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

    const addTaskFn = useCallback((title: string) => addTask({title, id}), [id]);
    const onClickRemoveTodoListHandler = useCallback(() => removeTodoList(id), [id]);
    const changeTodoListTitleFn = useCallback((title: string) => changeTodoListTitle({id, title}), [id]);
    const onClickAllChangeFilterHandler = useCallback(() => changeTodoListFilter({
        todoListId: id,
        filter: "all",
    }), [id]);
    const onClickActiveChangeFilterHandler = useCallback(() => changeTodoListFilter({
        todoListId: id,
        filter: "active"
    }), [id]);
    const onClickCompletedChangeFilterHandler = useCallback(() => changeTodoListFilter({
        todoListId: id,
        filter: "completed"
    }), [id]);

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
    demo?: boolean
};


