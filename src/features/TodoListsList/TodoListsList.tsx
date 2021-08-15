import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    actionsForTodoLists,
    createTodoList,
    fetchTodoLists,
    FilterValuesType,
    removeTodoList,
    TodoListDomainType,
    updateTodoListTitle
} from "./todoListsReducer";
import {createTask, removeTask, TasksStateType, updateTask} from "./tasksReducer";
import {Dispatch} from "redux";
import {TaskStatuses} from "../../api/todoListAPI";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {TodoList} from "./TodoList/TodoList";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";


export const TodoListsList: React.FC<TodoListsListPropsType> = React.memo((props) => {

    const {
        disabled,
        demo = false,
    } = props;

    const todoLists = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodoLists());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoList(todoListId));
    }, [dispatch]);
    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoList(title));
    }, [dispatch]);
    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(updateTodoListTitle(todoListId, title));
    }, [dispatch]);
    const changeTodoListFilter = useCallback((todoListId: string, filter: FilterValuesType) => {
        dispatch(actionsForTodoLists.updateTodoListFilter(todoListId, filter));
    }, [dispatch]);

    const deleteTask = useCallback((taskId: string, todoListId: string) => {
        dispatch(removeTask(taskId, todoListId));
    }, [dispatch]);
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(createTask(todoListId, title));
    }, [dispatch]);
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTask(todoListId, taskId, {status}));
    }, [dispatch]);
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(updateTask(todoListId, taskId, {title}));
    }, [dispatch]);


    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    const todoListsComponents = todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id]
            return (
                <Grid item key={tl.id}>
                    <Paper elevation={7} style={{padding: "20px", borderRadius: "10px"}}>
                        <TodoList
                            todoList={tl}
                            demo={demo}
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

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return (
        <>
            <Grid container style={{padding: "20px 10px"}}>
                <AddItemForm addItem={addTodoList} disabled={disabled}/>
            </Grid>
            <Grid container spacing={3}>
                {todoListsComponents}
            </Grid>
        </>
    );
});


// types
type TodoListsListPropsType = {
    disabled: boolean
    demo?: boolean
};