import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodoListAT = {
    type: "REMOVE-TODOLIST"
    todoListId: string
}
export type AddTodoListAT = {
    type: "ADD-TODOLIST"
    title: string
    todoListId: string
}
export type ChangeTodoListTitleAT = {
    type: "CHANGE-TODOLIST-TITLE"
    title: string
    todoListId: string
}
export type ChangeTodoListFilterAT = {
    type: "CHANGE-TODOLIST-FILTER"
    filter: FilterValuesType
    todoListId: string
}
export type ActionUnionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT

export const todoListId_1 = v1()
export const todoListId_2 = v1()

let initialState: Array<TodoListType> = [
    {id: todoListId_1, title: 'What should be done', filter: 'all'},
    {id: todoListId_2, title: 'What to buy', filter: 'all'},
] as Array<TodoListType>
export type InitialTodoListStateType = typeof initialState

export const todoListsReducer = (state = initialState, action: ActionUnionType): InitialTodoListStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId)
        case "ADD-TODOLIST":
            const newTodoList: TodoListType = {id: action.todoListId, title: action.title, filter: 'all'}
            return [newTodoList, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map( tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map( tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        default:
            return state
    }
}

export const RemoveTodoListAC = (todoListId: string): RemoveTodoListAT => ({type: "REMOVE-TODOLIST", todoListId})
export const AddTodoListAC = (title: string): AddTodoListAT => ({type: "ADD-TODOLIST", title, todoListId: v1()})
export const ChangeTodoListTitleAC = (title: string, todoListId: string): ChangeTodoListTitleAT => ({type: "CHANGE-TODOLIST-TITLE", title, todoListId})
export const ChangeTodoListFilterAC = (filter: FilterValuesType, todoListId: string): ChangeTodoListFilterAT => ({type: "CHANGE-TODOLIST-FILTER", filter, todoListId})
