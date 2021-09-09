import {todoListAPI, TodoListType} from "../../../api/todoListAPI";
import {abilityToAddTodoList, RequestStatusType, setAppStatus} from "../../../app/reducer/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


export const fetchTodoLists = createAsyncThunk("todoLists/fetchTodoLists",
    async (param, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatus("loading"));
            const res = await todoListAPI.getTodoLists();
            dispatch(setAppStatus("idle"));
            return res.data;
        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null);
        }
    });
export const deleteTodoList = createAsyncThunk("todoLists/deleteTodoList",
    async (todoListId: string, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "loading"}));
            let res = await todoListAPI.removeTodolist(todoListId);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("idle"));
                return todoListId;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null);
        }
    });
export const produceTodoList = createAsyncThunk("todoLists/produceTodoList",
    async (title: string, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(abilityToAddTodoList(true));
            let res = await todoListAPI.createTodolist(title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("succeeded"));
                dispatch(abilityToAddTodoList(false));
                return res.data.data.item;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null);
        }
    });
export const modernizeTodoListTitle = createAsyncThunk("todoLists/modernizeTodoListTitle",
    async (param: { todoListId: string, title: string }, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(updateTodoListEntityStatus({todoListId: param.todoListId, entityStatus: "loading"}));
            let res = await todoListAPI.updateTodoListTitle(param.todoListId, param.title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("idle"));
                dispatch(updateTodoListEntityStatus({todoListId: param.todoListId, entityStatus: "idle"}));
                return param;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null);
        }
    });


export const slice = createSlice({
    name: "todoLists",
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        updateTodoListFilter(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        updateTodoListEntityStatus(state, action: PayloadAction<{
            todoListId: string,
            entityStatus: RequestStatusType
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        },
        clearData(state) {
            return state = [] as Array<TodoListDomainType>;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                return action.payload.map((tl) => ({...tl, filter: 'all', entityStatus: "idle"}));
            })
            .addCase(deleteTodoList.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload);
                if (index > -1) {
                    state.splice(index, 1);
                }
            })
            .addCase(produceTodoList.fulfilled, (state, action) => {
                state.unshift({...action.payload, filter: "all", entityStatus: "idle"});
            })
            .addCase(modernizeTodoListTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todoListId);
                state[index].title = action.payload.title;
            })
    },
});

export const todoListsReducer = slice.reducer;

export const {clearData, updateTodoListEntityStatus, updateTodoListFilter,} = slice.actions;


// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
};