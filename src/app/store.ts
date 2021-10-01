import {tasksReducer} from "../features/TodoListsList/reducers/tasks-reducer";
import {todoListsReducer} from "../features/TodoListsList/reducers/todoLists-reducer";
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "./reducer/app-reducer";
import {authReducer} from "../features/login/reducer/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";


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


export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch();

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch);
    }, [actions, dispatch]);

    return boundActions;
}


export type RootReducerType = typeof rootReducer;
export type AppDispatchType = typeof store.dispatch;
export type AppRootStateType = ReturnType<RootReducerType>;


// @ts-ignore
window.store = store;

