import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodoListAC,
    todoListsReducer
} from "./store/todoListsReducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./store/tasksReducer";


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


function AppWithReducer() {
// BL:
    const todoListId_1 = v1()
    const todoListId_2 = v1()
    const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
        {id: todoListId_1, title: 'What should be done', filter: 'all'},
        {id: todoListId_2, title: 'What to buy', filter: 'all'}
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer,{
        [todoListId_1]: [
            {id: v1(), title: 'To plant a tree', isDone: false},
            {id: v1(), title: 'Build a house', isDone: false},
            {id: v1(), title: 'Raise a son', isDone: false}
        ],
        [todoListId_2]: [
            {id: v1(), title: 'Motorcycle', isDone: false},
            {id: v1(), title: 'New car', isDone: false}
        ],
    })

    const removeTodoList = (todoListId: string) => {
        dispatchToTodoLists(RemoveTodoListAC(todoListId))
        dispatchToTasks(RemoveTodoListAC(todoListId))
    }
    const addTodoList = (title: string) => {
        let action = AddTodoListAC(title)

        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        dispatchToTodoLists(ChangeTodoListTitleAC(title, todoListId))
    }
    const changeTodoListFilter = (filter: FilterValuesType, todoListId: string) => {
        dispatchToTodoLists(ChangeTodoListFilterAC(filter, todoListId))
    }

    const removeTask = (taskId: string, todoListId: string) => {
        dispatchToTasks(removeTaskAC(taskId, todoListId))
    }
    const addTask = (title: string, todoListId: string) => {
        dispatchToTasks(addTaskAC(title, todoListId))
    }
    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        dispatchToTasks(changeTaskStatusAC(taskId, newIsDoneValue, todoListId))
    }
    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        dispatchToTasks(changeTaskTitleAC(taskId, title, todoListId))
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

export default AppWithReducer;