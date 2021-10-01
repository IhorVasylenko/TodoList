import {createAsyncThunk} from "@reduxjs/toolkit";
import {abilityToAddTodoList, setAppStatus} from "../../../../app/reducer/app-reducer";
import {todoListAPI} from "../../../../api/todoList-API";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import {updateTodoListEntityStatus} from "../todoLists-reducer";


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

export const removeTodoList = createAsyncThunk("todoLists/deleteTodoList",
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

export const addTodoList = createAsyncThunk("todoLists/produceTodoList",
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

export const changeTodoListTitle = createAsyncThunk("todoLists/modernizeTodoListTitle",
    async (param: { id: string, title: string }, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(updateTodoListEntityStatus({todoListId: param.id, entityStatus: "loading"}));
            let res = await todoListAPI.updateTodoListTitle(param.id, param.title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus("idle"));
                dispatch(updateTodoListEntityStatus({todoListId: param.id, entityStatus: "idle"}));
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