import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatus} from "../../../../app/reducer/app-reducer";
import {AppRootStateType} from "../../../../app/store";
import {todoListAPI, UpdateTaskModelType} from "../../../../api/todoList-API";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import {updateTodoListEntityStatus} from "../todoLists-reducer";
import {UpdateDomainTaskModelType, updateTaskEntityStatus} from "../tasks-reducer";


export const fetchTask = createAsyncThunk('tasks/fetchTask', async (todoListId: string, {dispatch}) => {
    try {
        dispatch(setAppStatus("loading"));
        const res = await todoListAPI.getTasks(todoListId);
        dispatch(setAppStatus("idle"));
        return {todoListId, tasks: res.data.items};
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
});

export const removeTask = createAsyncThunk("tasks/deleteTask", async (param: { taskId: string, todoListId: string }, {dispatch}) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTaskEntityStatus({todoListId: param.todoListId, taskId: param.taskId, entityStatus: "loading"}));
        const res = await todoListAPI.removeTask(param.todoListId, param.taskId);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("idle"));
            return {todoListId: param.todoListId, taskId: param.taskId};
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
});

export const addTask = createAsyncThunk("tasks/produceTask", async (
    param: { id: string, title: string },
    {dispatch, rejectWithValue}
) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTodoListEntityStatus({todoListId: param.id, entityStatus: "loading"}));
        let res = await todoListAPI.createTask(param.id, param.title);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("idle"));
            dispatch(updateTodoListEntityStatus({todoListId: param.id, entityStatus: "idle"}));
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

export const modernizeTask = createAsyncThunk("tasks/modernizeTask", async (
    param: { todoListId: string, taskId: string, model: UpdateDomainTaskModelType },
    {dispatch, rejectWithValue, getState}) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTaskEntityStatus({todoListId: param.todoListId, taskId: param.taskId, entityStatus: "loading"}));
        const state = getState() as AppRootStateType;
        const task = state.tasks[param.todoListId].find(t => t.id === param.taskId);
        if (!task) {
            dispatch(setAppStatus("idle"));
            return rejectWithValue("task not found in the state");
        }
        const apiModel: UpdateTaskModelType = {
            status: task.status,
            description: task.description,
            title: task.title,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.model,
        };
        const res = await todoListAPI.updateTask(param.todoListId, param.taskId, apiModel);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("idle"));
            dispatch(updateTaskEntityStatus({
                todoListId: param.todoListId,
                taskId: param.taskId,
                entityStatus: "idle"
            }));
            return {taskId: param.taskId, model: param.model, todoListId: param.todoListId};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
        return rejectWithValue(null);
    }
});