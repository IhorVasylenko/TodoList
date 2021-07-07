import React, {useCallback, useEffect} from "react";
import {EditableSpan} from "./EditableSpan";
import {AddItemForm} from "./AddItemForm";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "./api/todoListAPI";
import {FilterValuesType} from "./store/todoListsReducer";
import {useDispatch} from "react-redux";
import {fetchTask} from "./store/tasksReducer";

export type TodoListPropsType = {
    todoListId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (todoListId: string, filter: FilterValuesType) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, title: string) => void
};

export const TodoList: React.FC<TodoListPropsType> = React.memo((props) => {

    const {
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
    } = props;

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTask(todoListId))
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
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
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
        (title: string) => changeTodoListTitle(todoListId, title),
        [changeTodoListTitle, todoListId]);
    const onClickAllChangeFilterHandler = useCallback(
        () => changeFilter(todoListId, 'all'),
        [changeFilter, todoListId]);
    const onClickActiveChangeFilterHandler = useCallback(
        () => changeFilter(todoListId, 'active'),
        [changeFilter, todoListId]);
    const onClickCompletedChangeFilterHandler = useCallback(
        () => changeFilter(todoListId, 'completed'),
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


