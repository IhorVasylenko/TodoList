import React, {useEffect} from 'react';
import './style/App.css';
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Menu} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import {TodoListsList} from "../features/TodoListsList";
import {useSelector} from "react-redux";
import {useAppDispatch} from "./store";
import {initializeApp} from "./reducer/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/login/Login";
import {Redirect, Route, Switch} from "react-router-dom";
import {Error404} from "../features/404/Error404";
import {logout} from "../features/login/reducer/auth-reducer";
import {loginSelectors} from "../features/login";
import {selectAddingTodoList, selectIsInitialized, selectStatus} from "./selectors/selectors";


export const App: React.FC<AppPropsType> = (props) => {

    const {
        demo = false,
    } = props;

    const appStatus = useSelector(selectStatus);
    const isAddingTodoList = useSelector(selectAddingTodoList);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(loginSelectors.selectIsLoggedIn);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!demo) {
            dispatch(initializeApp())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
    };

    if (!isInitialized) {
        return (
            <div
                style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
                <CircularProgress/>
            </div>
        );
    }


    return (
        <div className={"App"}>
            {
                appStatus === "loading"
                && <LinearProgress color={"secondary"}
                                   style={{position: "fixed", bottom: 0, height: "7px", right: 0, left: 0,}}/>
            }
            <AppBar position={"static"}>
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge={"start"} color={"inherit"}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        TodoLists
                    </Typography>
                    {
                        isLoggedIn
                        && <Button variant={"outlined"} color={"inherit"} onClick={logoutHandler}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route exact path={"/"}
                           render={
                               () => <TodoListsList disabled={isAddingTodoList} demo={demo}/>
                           }
                    />
                    <Route path={"/login"} render={() => <Login/>}/>
                    <Route path={"/404"} render={() => <Error404/>}/>
                    <Redirect from={"*"} to={"/404"}/>
                </Switch>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
};


// types
type AppPropsType = {
    demo?: boolean
};


