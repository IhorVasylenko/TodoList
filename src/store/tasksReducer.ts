import {v1} from "uuid";
import {CommonActionTypeForApp, InferActionType} from "../state/store";
import {TaskStatuses, TaskType, todoListAPI, TodoTaskPriority} from "../api/todoListAPI";
import {Dispatch} from "redux";


export type TasksStateType = {
    [key: string] : Array<TaskType>,
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
        case 'ADD_TASK':
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                todoListId: action.todoListId,
                order: 0,
                completed: false,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TodoTaskPriority.Low,
            }
            return({...state, [action.todoListId]: [newTask, ...state[action.todoListId]] })
        case 'CHANGE_TASK_STATUS':
            return ({
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, status: action.status}
                    : t)
            })
        case 'CHANGE_TASK_TITLE':
            return ({
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, title: action.title}
                    : t)
            })
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todoListId]: []
            }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        }
        case "SET-TODO-LISTS":{
            const copyState = {...state}
            action.todoLists.forEach((tl) => {
                copyState[tl.id] = []
            });
            return copyState;
        }
        case "SET-TASKS":
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
    addTask: (title: string, todoListId: string) => ({
        type: "ADD_TASK",
        title,
        todoListId,
    } as const),
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => ({
        type: "CHANGE_TASK_STATUS",
        taskId,
        status,
        todoListId,
    } as const),
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => ({
        type: "CHANGE_TASK_TITLE",
        taskId,
        title,
        todoListId,
    } as const),
    setTasks: (todoListId: string, tasks: TaskType[]) => ({
        type: "SET-TASKS",
        todoListId,
        tasks,
    } as const),
};

export const fetchTask = (todolistId: string) => (dispatch: Dispatch) => {
    todoListAPI.getTasks(todolistId)
        .then(res => {
            dispatch(actionsForTasks.setTasks(todolistId, res.data.items))
        });
};




