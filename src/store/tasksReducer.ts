import {TasksStateType, TasksType} from "../App";
import {v1} from "uuid";
import {CommonActionTypeForApp, InferActionType} from "../state/store";


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
            const newTask: TasksType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return({...state, [action.todoListId]: [newTask, ...state[action.todoListId]] })
        case 'CHANGE_TASK_STATUS':
            return ({
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId
                    ? {...t, isDone: action.newIsDoneValue}
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
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean, todoListId: string) => ({
        type: "CHANGE_TASK_STATUS",
        taskId,
        newIsDoneValue,
        todoListId,
    } as const),
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => ({
        type: "CHANGE_TASK_TITLE",
        taskId,
        title,
        todoListId,
    } as const),
};




