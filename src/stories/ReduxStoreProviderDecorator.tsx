import React from "react";
import {Provider} from "react-redux";
import {combineReducers} from "redux";
import {v1} from "uuid";
import {AppRootStateType, RootReducerType} from "../app/store";
import {tasksReducer} from "../features/TodoListsList/reducers/tasksReducer";
import {todoListsReducer} from "../features/TodoListsList/reducers/todoListsReducer";
import {TaskStatuses, TaskPriorities} from "../api/todoListAPI";
import {appReducer} from "../app/reducer/appReducer";
import thunk from "redux-thunk";
import {authReducer} from "../features/login/reducer/authReducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
});


const initialGlobalState: AppRootStateType = {
    todoLists: [
        {id: "todoListId1", title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "loading",},
        {id: "todoListId2", title: "What to buy", filter: "all", order: 0, addedDate: "", entityStatus: "idle",},
    ],
    tasks: {
        "todoListId1": [
            {
                description: '', title: "HTML&CSS", status: TaskStatuses.New,
                priority: TaskPriorities.Middle, startDate: '', deadline: '', id: v1(),
                todoListId: "todoListId1", order: 0, addedDate: '', entityStatus: "loading",
            },
            {
                description: '', title: "JS", status: TaskStatuses.New,
                priority: TaskPriorities.Middle, startDate: '', deadline: '', id: v1(),
                todoListId: "todoListId1", order: 0, addedDate: '', entityStatus: "idle",
            },
        ],
        "todoListId2": [
            {
                description: '', title: "Milk", status: TaskStatuses.Completed,
                priority: TaskPriorities.Middle, startDate: '', deadline: '', id: v1(),
                todoListId: "todoListId2", order: 0, addedDate: '', entityStatus: "idle",
            },
            {
                description: '', title: "React Book", status: TaskStatuses.Completed,
                priority: TaskPriorities.Middle, startDate: '', deadline: '', id: v1(),
                todoListId: "todoListId2", order: 0, addedDate: '', entityStatus: "idle",
            },
        ],
    },
    app: {
        status: "succeeded",
        error: null,
        addingTodoList: false,
        isInitialized: true,
    },
    auth: {
        isLoggedIn: true,
    },
};


export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => (
    <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
);