import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {TodoList} from "./TodoList/TodoList";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {useActions} from "../../app/store";
import {loginSelectors} from "../login";
import {todoListsActions, todoListSelectors} from "./";


export const TodoListsList: React.FC<TodoListsListPropsType> = React.memo((props) => {

    const {
        disabled,
        demo = false,
    } = props;

    const todoLists = useSelector(todoListSelectors.selectTodoList);
    const tasks = useSelector(todoListSelectors.selectTask);
    const isLoggedIn = useSelector(loginSelectors.selectIsLoggedIn);

    const {addTodoList, fetchTodoLists} = useActions(todoListsActions);

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodoLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const todoListsComponents = todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id];
            return (
                <Grid item key={tl.id}>
                    <Paper elevation={7} style={{padding: "20px", borderRadius: "10px",}}>
                        <TodoList
                            demo={demo}
                            todoList={tl}
                            tasks={tasksForTodoList}
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
            <Grid container style={{padding: "20px 10px",}}>
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