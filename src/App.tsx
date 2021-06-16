import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {AddTodoListAC, ChangeTodoListFilterAC, ChangeTodoListTitleAC, InitialTodoListStateType, RemoveTodoListAC
} from "./store/todoListsReducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, InitialTasksStateType, removeTaskAC
} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {Dispatch} from "redux";


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListType = {
    id: string,
    title: string,
    filter: FilterValuesType,
};
export type TasksType = {
    id: string,
    isDone: boolean,
    title: string,
};
export type TasksStateType = {
    [key: string] : Array<TasksType>,
};


function App() {
// BL:
    const tasks = useSelector<AppRootStateType, InitialTasksStateType>(state => state.tasks);
    const todoLists = useSelector<AppRootStateType, InitialTodoListStateType>(state => state.todoLists);

    const dispatch: Dispatch<any> = useDispatch();

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(RemoveTodoListAC(todoListId))
    }, [dispatch]);
    const addTodoList = useCallback((title: string) => {
        dispatch(AddTodoListAC(title))
    }, [dispatch]);
    const changeTodoListTitle = useCallback((title: string, todoListId: string) => {
        dispatch(ChangeTodoListTitleAC(title, todoListId))
    }, [dispatch]);
    const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
        dispatch(ChangeTodoListFilterAC(filter, todoListId))
    }, [dispatch]);

    const removeTask = useCallback((taskId: string, todoListId: string) => {
        dispatch(removeTaskAC(taskId, todoListId))
    }, [dispatch]);
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskAC(title, todoListId))
    }, [dispatch]);
    const changeTaskStatus = useCallback((taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(taskId, newIsDoneValue, todoListId))
    }, [dispatch]);
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(taskId, title, todoListId))
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
                            removeTask={removeTask}
                            addTask={addTask}
                            changeFilter={changeTodoListFilter}
                            changeTaskStatus={changeTaskStatus}
                            tasks={tasksForTodoList}
                            removeTodoList={removeTodoList}
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

export default App;