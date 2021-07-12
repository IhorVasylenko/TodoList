import {AppRootStateType, CommonActionTypeForApp, InferActionType} from "../../app/store";
import {todoListAPI, TodoListType} from "../../api/todoListAPI";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {actionsForApp, RequestStatusType} from "../../app/appReducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


let initialState = [] as Array<TodoListDomainType>;
export const todoListsReducer = (state: InitialTodoListStateType = initialState, action: CommonActionTypeForApp)
    : InitialTodoListStateType => {
    switch (action.type) {
        case "TODO/TODOLIST/REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId);
        case "TODO/TODOLIST/CREATE-TODOLIST":
            return [{...action.todoList, filter: "all", entityStatus: "idle"}, ...state];
        case "TODO/TODOLIST/UPDATE-TODOLIST-TITLE":
            return state.map( tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl);
        case "TODO/TODOLIST/UPDATE-TODOLIST-FILTER":
            return state.map( tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl);
        case "TODO/TODOLIST/SET-TODO-LISTS":
            return action.todoLists.map((tl) => ({...tl, filter: 'all', entityStatus: "idle"}));
        case "TODO/TODOLIST/UPDATE-TODOLIST-ENTITY-STATUS":
            return state.map( tl => tl.id === action.todoListId ? {...tl, entityStatus: action.entityStatus} : tl);
        default:
            return state;
    }
};


// actions
export const actionsForTodoLists = {
    removeTodoList: (todoListId: string) => ({
        type: "TODO/TODOLIST/REMOVE-TODOLIST",
        todoListId,
    } as const),
    createTodoList: (todoList: TodoListType) => ({
        type: "TODO/TODOLIST/CREATE-TODOLIST",
        todoList,
    } as const),
    updateTodoListTitle: (todoListId: string, title: string) => ({
        type: "TODO/TODOLIST/UPDATE-TODOLIST-TITLE",
        todoListId,
        title,
    } as const),
    updateTodoListFilter: (todoListId: string, filter: FilterValuesType) => ({
        type: "TODO/TODOLIST/UPDATE-TODOLIST-FILTER",
        todoListId,
        filter,
    } as const),
    setTodoLists: (todoLists: TodoListType[]) => ({
        type: "TODO/TODOLIST/SET-TODO-LISTS",
        todoLists
    } as const),
    updateTodoListEntityStatus: (todoListId: string, entityStatus: RequestStatusType) => ({
        type:"TODO/TODOLIST/UPDATE-TODOLIST-ENTITY-STATUS",
        todoListId,
        entityStatus,
    } as const),
};


// thanks
export const fetchTodoLists = (): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    todoListAPI.getTodoLists()
        .then((res) => {
            dispatch(actionsForTodoLists.setTodoLists(res.data));
            dispatch(actionsForApp.setAppStatus("idle"));
        });
};

export const removeTodoList = (todoListId: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    dispatch(actionsForTodoLists.updateTodoListEntityStatus(todoListId, "loading"));
    todoListAPI.removeTodolist(todoListId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(actionsForTodoLists.removeTodoList(todoListId));
                dispatch(actionsForApp.setAppStatus("idle"));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};

export const createTodoList = (title: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    dispatch(actionsForApp.abilityToAddTodoList(true));
    todoListAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(actionsForTodoLists.createTodoList(res.data.data.item));
                dispatch(actionsForApp.setAppStatus("succeeded"));
                dispatch(actionsForApp.abilityToAddTodoList(false));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};

export const updateTodoListTitle = (todoListId: string, title: string): ThunkType => (dispatch: ThunkDispatchType) => {
    dispatch(actionsForApp.setAppStatus("loading"));
    dispatch(actionsForTodoLists.updateTodoListEntityStatus(todoListId, "loading"));
    todoListAPI.updateTodoListTitle(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(actionsForTodoLists.updateTodoListTitle(todoListId, title));
                dispatch(actionsForApp.setAppStatus("idle"));
                dispatch(actionsForTodoLists.updateTodoListEntityStatus(todoListId, "idle"));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch);
        });
};


// types
export type InitialTodoListStateType = typeof initialState;
export type TodoListActionType = InferActionType<typeof actionsForTodoLists>;
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, CommonActionTypeForApp>;
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, CommonActionTypeForApp>