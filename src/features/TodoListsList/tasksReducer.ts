import {AppRootStateType, CommonActionTypeForApp, InferActionType} from "../../app/store";
import {
    TaskStatuses,
    TaskType,
    todoListAPI,
    TaskPriorities,
    UpdateTaskModelType,
} from "../../api/todoListAPI";
import {actionsForTodoLists, ThunkDispatchType, ThunkType} from "./todoListsReducer";
import {actionsForApp, RequestStatusType} from "../../app/appReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


let initialState = {} as TasksStateType;
export const tasksReducer = (state: InitialTasksStateType = initialState, action: CommonActionTypeForApp)
    : InitialTasksStateType=> {
    switch (action.type) {
        case "TODO/TASK/REMOVE-TASK":
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)};
        case "TODO/TASK/CREATE-TASK":
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]
            };
        case "TODO/TASK/UPDATE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            };
        case "TODO/TODOLIST/CREATE-TODOLIST":
            return {...state, [action.todoList.id]: []}
        case "TODO/TODOLIST/REMOVE-TODOLIST":
            let stateCopy = {...state};
            delete stateCopy[action.todoListId];
            return stateCopy;
        case "TODO/TODOLIST/SET-TODO-LISTS": {
            const copyState = {...state}
            action.todoLists.forEach((tl) => {
                copyState[tl.id] = []
            });
            return copyState;
        }
        case "TODO/TASK/SET-TASKS":
            return {...state, [action.todoListId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))};
        case "TODO/TASK/UPDATE-TASK-ENTITY-STATUS":
            return{
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId
                        ? {...t, entityStatus: action.entityStatus}
                        : t)
            };
        default:
            return state;
    }
};


// actions
export const actionsForTasks = {
    removeTask: (taskId: string, todoListId: string) => ({
        type: "TODO/TASK/REMOVE-TASK",
        taskId,
        todoListId,
    } as const),
    createTask: (task: TaskType) => ({
        type: "TODO/TASK/CREATE-TASK",
        task,
    } as const),
    updateTask: (taskId: string, model: UpdateDomainTaskModelType, todoListId: string) => ({
        type: "TODO/TASK/UPDATE-TASK",
        taskId,
        model,
        todoListId,
    } as const),
    setTasks: (todoListId: string, tasks: TaskType[]) => ({
        type: "TODO/TASK/SET-TASKS",
        todoListId,
        tasks,
    } as const),
    updateTaskEntityStatus: (todoListId: string, taskId: string, entityStatus: RequestStatusType) => ({
        type:"TODO/TASK/UPDATE-TASK-ENTITY-STATUS",
        todoListId,
        taskId,
        entityStatus,
    } as const),
};


// thanks
export const fetchTask = (todoListId: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    todoListAPI.getTasks(todoListId)
        .then((res) => {
            dispatch(actionsForTasks.setTasks(todoListId, res.data.items));
            dispatch(actionsForApp.setAppStatus("idle"));
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};

export const removeTask = (taskId: string, todoListId: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    dispatch(actionsForTasks.updateTaskEntityStatus(todoListId, taskId, "loading"));
    todoListAPI.removeTask(todoListId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(actionsForTasks.removeTask(taskId, todoListId));
                dispatch(actionsForApp.setAppStatus("idle"));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};

export const createTask = (todoListId: string, title: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    dispatch(actionsForTodoLists.updateTodoListEntityStatus(todoListId, "loading"));
    todoListAPI.createTask(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(actionsForTasks.createTask(res.data.data.item));
                dispatch(actionsForApp.setAppStatus("succeeded"));
                dispatch(actionsForTodoLists.updateTodoListEntityStatus(todoListId, "idle"));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};

export const updateTask = (todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType): ThunkType =>
    (dispatch: ThunkDispatchType, getState: () => AppRootStateType) => {
        dispatch(actionsForApp.setAppStatus("loading"));
        dispatch(actionsForTasks.updateTaskEntityStatus(todoListId, taskId, "loading"));
        const task = getState().tasks[todoListId].find( t => t.id === taskId);
        if (!task) {
            // throw new Error("task not found in the state");
            console.warn("task not found in the state");
            dispatch(actionsForApp.setAppStatus("failed"));
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
        todoListAPI.updateTask(todoListId, taskId, apiModel)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    dispatch(actionsForTasks.updateTask(taskId, domainModel, todoListId));
                    dispatch(actionsForApp.setAppStatus("idle"));
                    dispatch(actionsForTasks.updateTaskEntityStatus(todoListId, taskId, "idle"));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((err: AxiosError) => {
                handleServerNetworkError(err, dispatch);
            });
    };


// types
export type InitialTasksStateType = typeof initialState;
export type TaskActionType = InferActionType<typeof actionsForTasks>;
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType,
};
export type TasksStateType = {
    [key: string] : TaskDomainType[],
};
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
};




