import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodoListAT = ReturnType<typeof RemoveTodoListAC>;
export type AddTodoListAT = ReturnType<typeof AddTodoListAC>;
export type ChangeTodoListTitleAT = ReturnType<typeof ChangeTodoListTitleAC>;
export type ChangeTodoListFilterAT = ReturnType<typeof ChangeTodoListFilterAC>;
export type ActionUnionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT;


let initialState = [] as Array<TodoListType>;
export type InitialTodoListStateType = typeof initialState;

export const todoListsReducer = (state: InitialTodoListStateType = initialState, action: ActionUnionType)
    : InitialTodoListStateType => {
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

export const RemoveTodoListAC = (todoListId: string) => ({
    type: "REMOVE-TODOLIST" as const, todoListId
});
export const AddTodoListAC = (title: string) => ({
    type: "ADD-TODOLIST" as const, title, todoListId: v1()
});
export const ChangeTodoListTitleAC = (title: string, todoListId: string) => ({
    type: "CHANGE-TODOLIST-TITLE" as const, title, todoListId
});
export const ChangeTodoListFilterAC = (filter: FilterValuesType, todoListId: string) => ({
    type: "CHANGE-TODOLIST-FILTER" as const, filter, todoListId
});
