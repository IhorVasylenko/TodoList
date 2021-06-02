import React from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC, InitialTodoListStateType,
    RemoveTodoListAC
} from "./store/todoListsReducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    InitialTasksStateType,
    removeTaskAC
} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {Dispatch} from "redux";


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksType = {
    id: string
    isDone: boolean
    title: string
}
export type TasksStateType = {
    [key: string] : Array<TasksType>
}


function App() {
// BL:
    const tasks = useSelector<AppRootStateType, InitialTasksStateType>(state => state.tasks)
    const todoLists = useSelector<AppRootStateType, InitialTodoListStateType>(state => state.todoLists)

    const dispatch: Dispatch<any> = useDispatch()

    const removeTodoList = (todoListId: string) => {
        dispatch(RemoveTodoListAC(todoListId))
    }
    const addTodoList = (title: string) => {
        dispatch(AddTodoListAC(title))
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        dispatch(ChangeTodoListTitleAC(title, todoListId))
    }
    const changeTodoListFilter = (filter: FilterValuesType, todoListId: string) => {
        dispatch(ChangeTodoListFilterAC(filter, todoListId))
    }

    const removeTask = (taskId: string, todoListId: string) => {
        dispatch(removeTaskAC(taskId, todoListId))
    }
    const addTask = (title: string, todoListId: string) => {
        dispatch(addTaskAC(title, todoListId))
    }
    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(taskId, newIsDoneValue, todoListId))
    }
    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(taskId, title, todoListId))
    }

// UI:
    const getTaskForTodoList = (todoList: TodoListType) => {
        switch (todoList.filter) {
            case "active":
                return tasks[todoList.id].filter(task => !task.isDone)
            case "completed":
                return tasks[todoList.id].filter(task => task.isDone)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListsComponents = todoLists.map(tl => {
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
                            tasks={getTaskForTodoList(tl)}
                            removeTodoList={removeTodoList}
                            changeTaskTitle={changeTaskTitle}
                            changeTodoListTitle={changeTodoListTitle}
                        />
                    </Paper>
                </Grid>
            )
        }
    )

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
    )
}

export default App;