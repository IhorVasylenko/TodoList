import React from 'react';
import './App.css';
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Menu} from "@material-ui/icons";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {AppInitialStateType} from "./appReducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";


export const App: React.FC<AppPropsType>  = (props) => {
    const {
        demo = false,
    } = props

    const appState = useSelector<AppRootStateType, AppInitialStateType>(state => state.app)

    return (
        <div className={"App"}>
            {appState.status === "loading" && <LinearProgress
                color={"primary"}
                style={{
                    position: "fixed",
                    bottom: 0,
                    height: "7px",
                    right: 0,
                    left: 0,
                }}/>}
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
                <TodoListsList disabled={appState.addingTodoList} demo={demo}/>
            </Container>
            <ErrorSnackbar />
        </div>
    );
}


// types
type AppPropsType = {
    demo?: boolean
}


