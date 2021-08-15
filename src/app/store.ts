import {TaskActionType, tasksReducer} from "../features/TodoListsList/tasksReducer";
import {TodoListActionType, todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {AppActionType, appReducer} from "./appReducer";
import {AuthActionType, authReducer} from "../features/login/authReducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type CommonActionTypeForApp = TodoListActionType | TaskActionType | AppActionType | AuthActionType;

export type InferActionType<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never;


// @ts-ignore
window.store = store;

