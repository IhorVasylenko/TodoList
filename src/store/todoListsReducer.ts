import {CommonActionTypeForApp, InferActionType} from "../state/store";
import {todoListAPI, TodoListType} from "../api/todoListAPI";
import {Dispatch} from "redux";


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
};

let initialState = [] as Array<TodoListDomainType>;

export type InitialTodoListStateType = typeof initialState;
export type TodoListActionType = InferActionType<typeof actionsForTodoLists>;

export const todoListsReducer = (state: InitialTodoListStateType = initialState, action: CommonActionTypeForApp)
    : InitialTodoListStateType => {
    switch (action.type) {
        case "REMOVE_TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId);
        case "CREATE_TODOLIST":
            return [{...action.todoList, filter: "all"}, ...state];
        case "UPDATE_TODOLIST_TITLE":
            return state.map( tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl);
        case "UPDATE_TODOLIST_FILTER":
            return state.map( tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl);
        case "SET_TODO_LISTS":
            return action.todoLists.map((tl) => ({...tl, filter: 'all'}));
        default:
            return state;
    }
};

export const actionsForTodoLists = {
    removeTodoList: (todoListId: string) => ({
        type: "REMOVE_TODOLIST",
        todoListId,
    } as const),
    createTodoList: (todoList: TodoListType) => ({
        type: "CREATE_TODOLIST",
        todoList,
    } as const),
    updateTodoListTitle: (todoListId: string, title: string) => ({
        type: "UPDATE_TODOLIST_TITLE",
        todoListId,
        title,
    } as const),
    updateTodoListFilter: (todoListId: string, filter: FilterValuesType) => ({
        type: "UPDATE_TODOLIST_FILTER",
        todoListId,
        filter,
    } as const),
    setTodoLists: (todoLists: TodoListType[]) => ({
        type: "SET_TODO_LISTS",
        todoLists
    } as const),
};

export const fetchTodoLists = () => (dispatch: Dispatch) => {
    todoListAPI.getTodoLists()
        .then(res => {
            dispatch(actionsForTodoLists.setTodoLists(res.data))
        });
};
export const removeTodoList = (todoListId: string) => (dispatch: Dispatch) => {
    todoListAPI.removeTodolist(todoListId)
        .then(() => {
            dispatch(actionsForTodoLists.removeTodoList(todoListId))
        });
};
export const createTodoList = (title: string) => (dispatch: Dispatch) => {
    todoListAPI.createTodolist(title)
        .then((res) => {
            dispatch(actionsForTodoLists.createTodoList(res.data.data.item))
        });
};
export const updateTodoListTitle = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    todoListAPI.updateTodoListTitle(todoListId, title)
        .then(() => {
            dispatch(actionsForTodoLists.updateTodoListTitle(todoListId, title))
        });
};
