import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {actionsForTodoLists, createTodoList, fetchTodoLists, FilterValuesType,removeTodoList,
    TodoListDomainType, updateTodoListTitle} from "./store/todoListsReducer";
import {createTask, removeTask, TasksStateType, updateTask} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {Dispatch} from "redux";
import {TaskStatuses} from "./api/todoListAPI";


export function App() {
    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
        dispatch(fetchTodoLists())
    }, []);

    const deleteTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoList(todoListId))
    }, [dispatch]);
    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoList(title))
    }, [dispatch]);
    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(updateTodoListTitle(todoListId, title))
    }, [dispatch]);
    const changeTodoListFilter = useCallback((todoListId: string, filter: FilterValuesType) => {
        dispatch(actionsForTodoLists.updateTodoListFilter(todoListId, filter))
    }, [dispatch]);

    const deleteTask = useCallback((taskId: string, todoListId: string) => {
        dispatch(removeTask(taskId, todoListId))
    }, [dispatch]);
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(createTask(todoListId, title))
    }, [dispatch]);
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTask(todoListId, taskId, {status}))
    }, [dispatch]);
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(updateTask(todoListId, taskId, {title}))
    }, [dispatch]);

// UI:
    const todoListsComponents = todoLists.map(tl => {
        let tasksForTodoList = tasks[tl.id]
            return (
                <Grid item key={tl.id}>
                    <Paper elevation={7} style={{padding: "20px", borderRadius: "10px"}}>
                        <TodoList
                            todoListId={tl.id}
                            title={tl.title}
                            filter={tl.filter}
                            removeTask={deleteTask}
                            addTask={addTask}
                            changeFilter={changeTodoListFilter}
                            changeTaskStatus={changeTaskStatus}
                            tasks={tasksForTodoList}
                            removeTodoList={deleteTodoList}
                            changeTaskTitle={changeTaskTitle}
                            changeTodoListTitle={changeTodoListTitle}
                        />
                    </Paper>
                </Grid>
            );
        }
    );

    return (
        <div className={"App"}>
            <AppBar position={"static"}>
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge={"start"} color={"inherit"} >
                        <Menu />
                    </IconButton>
                    <Typography variant={"h6"} >
                        TodoLists
                    </Typography>
                    <Button variant={"outlined"} color={"inherit"} >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 10px"}}>
                    <AddItemForm addItem={addTodoList} />
                </Grid>
                <Grid container spacing={3}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}