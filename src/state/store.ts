import {TaskActionType, tasksReducer} from "../store/tasksReducer";
import {TodoListActionType, todoListsReducer} from "../store/todoListsReducer";
import {combineReducers, createStore} from 'redux';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
});

export const store = createStore(rootReducer);

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type CommonActionTypeForApp = TodoListActionType | TaskActionType;

export type InferActionType<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never;

// @ts-ignore
window.store = store;

