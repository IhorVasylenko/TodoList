import {tasksReducer} from "../features/TodoListsList/reducers/tasksReducer";
import {todoListsReducer} from "../features/TodoListsList/reducers/todoListsReducer";
import {combineReducers} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "./reducer/appReducer";
import {authReducer} from "../features/login/reducer/authReducer";
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

