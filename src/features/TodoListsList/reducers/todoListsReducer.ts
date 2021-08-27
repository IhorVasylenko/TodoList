import {AppDispatchType} from "../../../app/store";
import {todoListAPI, TodoListType} from "../../../api/todoListAPI";
import {abilityToAddTodoList, RequestStatusType, setAppStatus, ThunkType} from "../../../app/reducer/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState = [] as Array<TodoListDomainType>;

export const slice = createSlice({
    name: "todoLists",
    initialState,
    reducers: {
        removeTodoList(state, action: PayloadAction<string>) {
            const index = state.findIndex(tl => tl.id === action.payload);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        createTodoList(state, action: PayloadAction<TodoListType>) {
            state.unshift({...action.payload, filter: "all", entityStatus: "idle"});
        },
        updateTodoListTitle(state, action: PayloadAction<{ todoListId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].title = action.payload.title;
        },
        updateTodoListFilter(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        setTodoLists(state, action: PayloadAction<TodoListType[]>) {
            return action.payload.map((tl) => ({...tl, filter: 'all', entityStatus: "idle"}));
        },
        updateTodoListEntityStatus(state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        },
        clearData(state) {
            return state = initialState;
        },
    },
});

export const todoListsReducer = slice.reducer;

export const {
    removeTodoList,
    createTodoList,
    clearData,
    setTodoLists,
    updateTodoListEntityStatus,
    updateTodoListFilter,
    updateTodoListTitle
} = slice.actions;


// thanks
export const fetchTodoLists = (): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        let res = await todoListAPI.getTodoLists();
        dispatch(setTodoLists(res.data));
        dispatch(setAppStatus("idle"));
        // res.data.forEach((tl) => {
        //     dispatch(fetchTask(tl.id));
        // })
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const deleteTodoList = (todoListId: string): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "loading"}));
        let res = await todoListAPI.removeTodolist(todoListId);
        if (res.data.resultCode === 0) {
            dispatch(removeTodoList(todoListId));
            dispatch(setAppStatus("idle"));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const produceTodoList = (title: string): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(abilityToAddTodoList(true));
        let res = await todoListAPI.createTodolist(title);
        if (res.data.resultCode === 0) {
            dispatch(createTodoList(res.data.data.item));
            dispatch(setAppStatus("succeeded"));
            dispatch(abilityToAddTodoList(false));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const modernizeTodoListTitle = (todoListId: string, title: string): ThunkType =>
    async (dispatch: AppDispatchType) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "loading"}));
            let res = await todoListAPI.updateTodoListTitle(todoListId, title);
            if (res.data.resultCode === 0) {
                dispatch(updateTodoListTitle({todoListId, title}));
                dispatch(setAppStatus("idle"));
                dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "idle"}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
        }
    };


// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
};