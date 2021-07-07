import {AppRootStateType, CommonActionTypeForApp, InferActionType} from "../state/store";
import {TaskStatuses, TaskType, todoListAPI, TaskPriorities, UpdateTaskModelType} from "../api/todoListAPI";
import {Dispatch} from "redux";


export type TasksStateType = {
    [key: string] : TaskType[],
};

let initialState = {} as TasksStateType;

export type InitialTasksStateType = typeof initialState;
export type TaskActionType = InferActionType<typeof actionsForTasks>;

export const tasksReducer = (state: InitialTasksStateType = initialState, action: CommonActionTypeForApp)
    : InitialTasksStateType=> {
    switch (action.type) {
        case "REMOVE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "CREATE_TASK":
            return({...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] })
        case "UPDATE_TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, ...action.model}
                    : t)
            }
        case "CREATE_TODOLIST":
            return {
                ...state,
                [action.todoList.id]: []
            }
        case "REMOVE_TODOLIST": {
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        }
        case "SET_TODO_LISTS":{
            const copyState = {...state}
            action.todoLists.forEach((tl) => {
                copyState[tl.id] = []
            });
            return copyState;
        }
        case "SET_TASKS":
            return {...state, [action.todoListId]: action.tasks};
        default:
            return state
    }
};

export const actionsForTasks = {
    removeTask: (taskId: string, todoListId: string) => ({
        type: "REMOVE_TASK",
        taskId,
        todoListId,
    } as const),
    createTask: (task: TaskType) => ({
        type: "CREATE_TASK",
        task,
    } as const),
    updateTask: (taskId: string, model: UpdateDomainTaskModelType, todoListId: string) => ({
        type: "UPDATE_TASK",
        taskId,
        model,
        todoListId,
    } as const),
    setTasks: (todoListId: string, tasks: TaskType[]) => ({
        type: "SET_TASKS",
        todoListId,
        tasks,
    } as const),
};

export const fetchTask = (todoListId: string) => (dispatch: Dispatch) => {
    todoListAPI.getTasks(todoListId)
        .then(res => {
            dispatch(actionsForTasks.setTasks(todoListId, res.data.items))
        });
};
export const removeTask = (id: string, todoListId: string) => (dispatch: Dispatch) => {
    todoListAPI.removeTask(todoListId, id)
        .then(() => {
            dispatch(actionsForTasks.removeTask(id, todoListId))
        })
};
export const createTask = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    todoListAPI.createTask(todoListId, title)
        .then(res => {
            dispatch(actionsForTasks.createTask(res.data.data.item))
        })
};

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
};
export const updateTask = (todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todoListId].find( t => t.id === taskId);
        if (!task) {
            // throw new Error("task not found in the state")
            console.warn("task not found in the state")
            return;
        }
        const apiModel: UpdateTaskModelType = {
            status: task.status,
            description: task.description,
            title: task.title,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        todoListAPI.updateTask(todoListId, taskId, apiModel)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    dispatch(actionsForTasks.updateTask(taskId, domainModel, todoListId))
                }
            })
    };




