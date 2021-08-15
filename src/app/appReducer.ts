import {AppRootStateType, CommonActionTypeForApp, InferActionType} from "./store";
import {authAPI} from "../api/todoListAPI";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {actionsForAuth} from "../features/login/authReducer";


const initialState = {
    status: "idle",
    error: null,
    addingTodoList: false,
    isInitialized: false,
} as AppInitialStateType;

export const appReducer = (state: InitialAppStateType = initialState, action: CommonActionTypeForApp): InitialAppStateType => {
    switch (action.type) {
        case "TODO/APP/SET-STATUS":
            return {...state, status: action.status};
        case "TODO/APP/SET-ERROR":
            return {...state, error: action.error};
        case "TODO/APP/ABILITY-TO-ADD-TODOLIST":
            return {...state, addingTodoList: action.ability};
        case "TODO/APP/IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized};
        default:
            return state;
    }
};


// actions
export const actionsForApp = {
    setAppStatus: (status: RequestStatusType) => ({type: "TODO/APP/SET-STATUS", status} as const),
    setAppError: (error: string | null) => ({type: "TODO/APP/SET-ERROR", error} as const),
    abilityToAddTodoList: (ability: boolean) => ({type: "TODO/APP/ABILITY-TO-ADD-TODOLIST", ability} as const),
    setIsInitialized: (isInitialized: boolean) => ({type: "TODO/APP/IS-INITIALIZED", isInitialized} as const),
};


// thunks
export const initializeApp = (): ThunkType => async (dispatch: ThunkDispatchType) => {
    try {
        let res = await authAPI.me();
        if (res.data.resultCode === 0) {
            dispatch(actionsForAuth.setIsLoggedIn(true));
            dispatch(actionsForApp.setIsInitialized(true));
        }
    } finally {
        dispatch(actionsForApp.setIsInitialized(true));
    }
};


// types
export type InitialAppStateType = typeof initialState;
export type AppActionType = InferActionType<typeof actionsForApp>;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = {
    status: RequestStatusType
    error: string | null
    addingTodoList: boolean
    isInitialized: boolean
};
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, CommonActionTypeForApp>;
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, CommonActionTypeForApp>;

