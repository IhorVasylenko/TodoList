import {TasksStateType, TasksType} from "../App";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT} from "./todoListsReducer";

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>;
export type AddTaskAT = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>;
export type ActionUnionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT
    | ChangeTaskTitleAT | AddTodoListAT | RemoveTodoListAT;

let initialState = {} as TasksStateType;
export type InitialTasksStateType = typeof initialState;

export const tasksReducer = (state: InitialTasksStateType = initialState, action: ActionUnionType)
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
}

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: "REMOVE_TASK" as const, taskId, todoListId,
});
export const addTaskAC = (title: string, todoListId: string) => ({
    type: 'ADD_TASK' as const, title, todoListId,
});
export const changeTaskStatusAC = (taskId: string, newIsDoneValue: boolean, todoListId: string) => ({
    type: 'CHANGE_TASK_STATUS' as const, taskId, newIsDoneValue, todoListId,
});
export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string) => ({
    type: 'CHANGE_TASK_TITLE' as const, taskId, title, todoListId,
});




