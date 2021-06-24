import {tasksReducer} from "../store/tasksReducer";
import {todoListsReducer} from "../store/todoListsReducer";
import {combineReducers, createStore} from 'redux';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
});

export const store = createStore(rootReducer);

export type AppRootStateType = ReturnType<typeof rootReducer>;


// @ts-ignore
window.store = store;

