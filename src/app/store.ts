import {tasksReducer} from "../features/TodoListsList/tasksReducer";
import {todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {combineReducers} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "./appReducer";
import {authReducer} from "../features/login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
});


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});
export const useAppDispatch = () => useDispatch<AppDispatchType>();


export type RootReducerType = typeof rootReducer;
export type AppDispatchType = typeof store.dispatch;
export type AppRootStateType = ReturnType<RootReducerType>;


// @ts-ignore
window.store = store;

