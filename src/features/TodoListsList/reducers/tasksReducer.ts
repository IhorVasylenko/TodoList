import {AppDispatchType, AppRootStateType} from "../../../app/store";
import {TaskStatuses, TaskType, todoListAPI, TaskPriorities, UpdateTaskModelType} from "../../../api/todoListAPI";
import {RequestStatusType, setAppStatus, ThunkType} from "../../../app/reducer/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {clearData, createTodoList, removeTodoList, setTodoLists, updateTodoListEntityStatus} from "./todoListsReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState = {} as TasksStateType;

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{taskId: string, todoListId: string}>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        },
        createTask(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
        },
        updateTask(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todoListId: string}>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        },
        setTasks(state, action: PayloadAction<{todoListId: string, tasks: TaskType[]}>) {
            state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}));
        },
        updateTaskEntityStatus(state, action: PayloadAction<{todoListId: string, taskId: string, entityStatus: RequestStatusType}>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTodoList, (state, action) => {
            state[action.payload.id] = [];
        })
            .addCase(removeTodoList, (state, action) => {
            delete state[action.payload];
        })
            .addCase(setTodoLists, (state, action) => {
            action.payload.forEach(tl => state[tl.id] = []);
        })
            .addCase(clearData, (state) => {
            return state = initialState;
        })
    },
});

export const tasksReducer = slice.reducer;
export const {removeTask, createTask, setTasks, updateTask, updateTaskEntityStatus} = slice.actions;


// thanks
export const fetchTask = (todoListId: string): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        let res = await todoListAPI.getTasks(todoListId);
        dispatch(setTasks({todoListId, tasks: res.data.items}));
        dispatch(setAppStatus("idle"));
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const deleteTask = (taskId: string, todoListId: string): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTaskEntityStatus({todoListId, taskId, entityStatus: "loading"}));
        let res = await todoListAPI.removeTask(todoListId, taskId);
        if (res.data.resultCode === 0) {
            dispatch(removeTask({taskId, todoListId}));
            dispatch(setAppStatus("idle"));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const produceTask = (todoListId: string, title: string): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        dispatch(setAppStatus("loading"));
        dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "loading"}));
        let res = await todoListAPI.createTask(todoListId, title);
        if (res.data.resultCode === 0) {
            dispatch(createTask(res.data.data.item));
            dispatch(setAppStatus("idle"));
            dispatch(updateTodoListEntityStatus({todoListId, entityStatus: "idle"}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const modernizeTask = (todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType): ThunkType =>
    async (dispatch: AppDispatchType, getState: () => AppRootStateType) => {
        try {
            dispatch(setAppStatus("loading"));
            dispatch(updateTaskEntityStatus({todoListId, taskId, entityStatus: "loading"}));
            const task = getState().tasks[todoListId].find(t => t.id === taskId);
            if (!task) {
                // throw new Error("task not found in the state");
                console.warn("task not found in the state");
                dispatch(setAppStatus("idle"));
                return;
            }
            const apiModel: UpdateTaskModelType = {
                status: task.status,
                description: task.description,
                title: task.title,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel,
            };
            let res = await todoListAPI.updateTask(todoListId, taskId, apiModel);
            if (res.data.resultCode === 0) {
                dispatch(updateTask({taskId, model: domainModel, todoListId}));
                dispatch(setAppStatus("idle"));
                dispatch(updateTaskEntityStatus({todoListId, taskId, entityStatus: "idle"}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
        }
    };


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




