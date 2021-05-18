import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodoListAT = {
    type: "REMOVE-TODOLIST"
    todoListId: string
}
export type AddTodoListAC = {
    type: "ADD-TODOLIST"
    title: string
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
export type ActionUnionType = RemoveTodoListAT | AddTodoListAC | ChangeTodoListTitleAT | ChangeTodoListFilterAT

export const todoListsReducer = (todoLists: Array<TodoListType>, action: ActionUnionType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(tl => tl.id !== action.todoListId)
        case "ADD-TODOLIST":
            const newTodoList: TodoListType = {id: v1(), title: action.title, filter: 'all'}
            return [newTodoList, ...todoLists]
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map( tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map( tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        default:
            throw todoLists
    }
}

export const RemoveTodoListAC = (todoListId: string): RemoveTodoListAT => ({type: "REMOVE-TODOLIST", todoListId})
export const AddTodoListAC = (title: string): AddTodoListAC => ({type: "ADD-TODOLIST", title})
export const ChangeTodoListTitleAC = (title: string, todoListId: string): ChangeTodoListTitleAT => ({type: "CHANGE-TODOLIST-TITLE", title, todoListId})
export const ChangeTodoListFilterAC = (filter: FilterValuesType, todoListId: string): ChangeTodoListFilterAT => ({type: "CHANGE-TODOLIST-FILTER", filter, todoListId})
