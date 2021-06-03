import {TasksStateType, TasksType} from "../App";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT/*, todoListId_1, todoListId_2*/} from "./todoListsReducer";

export type RemoveTaskAT = {
    type: 'REMOVE_TASK'
    taskId: string
    todoListId: string
}
export type AddTaskAT = {
    type: 'ADD_TASK'
    title: string
    todoListId: string
}
export type ChangeTaskStatusAT = {
    type: 'CHANGE_TASK_STATUS'
    taskId: string
    newIsDoneValue: boolean
    todoListId: string
}
export type ChangeTaskTitleAT = {
    type: 'CHANGE_TASK_TITLE'
    taskId: string
    title: string
    todoListId: string
}
export type ActionUnionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT
    | ChangeTaskTitleAT | AddTodoListAT | RemoveTodoListAT



let initialState: TasksStateType = {/*
    [todoListId_1]: [
        {id: v1(), title: 'To plant a tree', isDone: false},
        {id: v1(), title: 'Build a house', isDone: false},
        {id: v1(), title: 'Raise a son', isDone: false}
    ],
    [todoListId_2]: [
        {id: v1(), title: 'Motorcycle', isDone: false},
        {id: v1(), title: 'New car', isDone: false}
    ],
*/} as TasksStateType
export type InitialTasksStateType = typeof initialState

export const tasksReducer = (state: InitialTasksStateType = initialState, action: ActionUnionType): InitialTasksStateType=> {
    switch (action.type) {
        case 'REMOVE_TASK':
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

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskAT => {
    return {type: 'REMOVE_TASK', taskId, todoListId}
}
export const addTaskAC = (title: string, todoListId: string): AddTaskAT => {
    return {type: 'ADD_TASK', title, todoListId}
}
export const changeTaskStatusAC = (taskId: string, newIsDoneValue: boolean, todoListId: string): ChangeTaskStatusAT => {
    return {type: 'CHANGE_TASK_STATUS', taskId, newIsDoneValue, todoListId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleAT => {
    return {type: 'CHANGE_TASK_TITLE', taskId, title, todoListId}
}



