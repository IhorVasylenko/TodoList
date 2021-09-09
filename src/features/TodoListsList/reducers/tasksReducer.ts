import {AppRootStateType} from "../../../app/store";
import {TaskPriorities, TaskStatuses, TaskType, todoListAPI, UpdateTaskModelType} from "../../../api/todoListAPI";
import {RequestStatusType, setAppStatus} from "../../../app/reducer/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {
    clearData,
    deleteTodoList,
    fetchTodoLists,
    produceTodoList,
    updateTodoListEntityStatus
} from "./todoListsReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


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

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (param: { taskId: string, todoListId: string }, {dispatch}) => {
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

export const produceTask = createAsyncThunk("tasks/produceTask", async (
    param: { todoListId: string, title: string },
    {dispatch, rejectWithValue}
) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTodoListEntityStatus({todoListId: param.todoListId, entityStatus: "loading"}));
        let res = await todoListAPI.createTask(param.todoListId, param.title);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("idle"));
            dispatch(updateTodoListEntityStatus({todoListId: param.todoListId, entityStatus: "idle"}));
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


const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        updateTaskEntityStatus(state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(produceTodoList.fulfilled, (state, action) => {
                state[action.payload.id] = [];
            })
            .addCase(deleteTodoList.fulfilled, (state, action) => {
                delete state[action.payload];
            })
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                action.payload.forEach(tl => state[tl.id] = []);
            })
            .addCase(clearData, (state) => {
                return state = {} as TasksStateType;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}));
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todoListId];
                    // @ts-ignore
                    const index = tasks.findIndex(t => t.id === action.payload.taskId);
                    if (index > -1) {
                        tasks.splice(index, 1);
                    }
                }
            })
            .addCase(produceTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
            })
            .addCase(modernizeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model};
                }
            })
    },
});

export const tasksReducer = slice.reducer;
export const {updateTaskEntityStatus} = slice.actions;


// types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
};
export type TasksStateType = {
    [key: string]: TaskDomainType[]
};
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
};




