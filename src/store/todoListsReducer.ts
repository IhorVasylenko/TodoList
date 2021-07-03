import {v1} from "uuid";
import {CommonActionTypeForApp, InferActionType} from "../state/store";
import {TodoListType} from "../api/todoListAPI";


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

let initialState = [] as Array<TodoListDomainType>;

export type InitialTodoListStateType = typeof initialState;
export type TodoListActionType = InferActionType<typeof actionsForTodoLists>;

export const todoListsReducer = (state: InitialTodoListStateType = initialState, action: CommonActionTypeForApp)
    : InitialTodoListStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId);
        case "ADD-TODOLIST":
            const newTodoList: TodoListDomainType = {
                id: action.todoListId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0,
            };
            return [newTodoList, ...state];
        case "CHANGE-TODOLIST-TITLE":
            return state.map( tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl);
        case "CHANGE-TODOLIST-FILTER":
            return state.map( tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl);
        default:
            return state;
    }
};

export const actionsForTodoLists = {
    removeTodoList: (todoListId: string) => ({
        type: "REMOVE-TODOLIST",
        todoListId
    } as const),
    addTodoList: (title: string) => ({
        type: "ADD-TODOLIST",
        title,
        todoListId: v1()
    } as const),
    changeTodoListTitle: (title: string, todoListId: string) => ({
        type: "CHANGE-TODOLIST-TITLE",
        title,
        todoListId,
    } as const),
    changeTodoListFilter: (filter: FilterValuesType, todoListId: string) => ({
        type: "CHANGE-TODOLIST-FILTER",
        filter,
        todoListId,
    } as const),
};
