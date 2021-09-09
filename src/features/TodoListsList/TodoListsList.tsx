import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType, useAppDispatch} from "../../app/store";
import {
    produceTodoList,
    fetchTodoLists,
    FilterValuesType,
    TodoListDomainType,
    modernizeTodoListTitle,
    updateTodoListFilter, deleteTodoList
} from "./reducers/todoListsReducer";
import {produceTask, TasksStateType, modernizeTask, deleteTask} from "./reducers/tasksReducer";
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

    const dispatch: AppDispatchType = useAppDispatch();

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodoLists());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(deleteTodoList(todoListId));
    }, [dispatch]);
    const addTodoList = useCallback((title: string) => {
        dispatch(produceTodoList(title));
    }, [dispatch]);
    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(modernizeTodoListTitle({todoListId, title}));
    }, [dispatch]);
    const changeTodoListFilter = useCallback((todoListId: string, filter: FilterValuesType) => {
        dispatch(updateTodoListFilter({todoListId, filter}));
    }, [dispatch]);

    const removeTask = useCallback((taskId: string, todoListId: string) => {
        dispatch(deleteTask({taskId, todoListId}));
    }, [dispatch]);
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(produceTask({todoListId, title}));
    }, [dispatch]);
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(modernizeTask({todoListId, taskId, model: {status}}));
    }, [dispatch]);
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(modernizeTask({todoListId, taskId, model: {title}}));
    }, [dispatch]);

    const todoListsComponents = todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id]
            return (
                <Grid item key={tl.id}>
                    <Paper elevation={7} style={{padding: "20px", borderRadius: "10px"}}>
                        <TodoList
                            todoList={tl}
                            demo={demo}
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