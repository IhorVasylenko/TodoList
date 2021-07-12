import {CommonActionTypeForApp, InferActionType} from "./store";


const initialState = {
    status: 'idle',
    error: null,
    addingTodoList: false,
} as AppInitialStateType;

export const appReducer = (state: InitialAppStateType = initialState, action: CommonActionTypeForApp): InitialAppStateType => {
    switch (action.type) {
        case "TODO/APP/SET-STATUS":
            return {...state, status: action.status};
        case "TODO/APP/SET-ERROR":
            return {...state, error: action.error};
        case "TODO/APP/ABILITY-TO-ADD-TODOLIST":
            return {...state, addingTodoList: action.ability};
        default:
            return state;
    }
};


// actions
export const actionsForApp = {
    setAppStatus: (status: RequestStatusType) => ({type: "TODO/APP/SET-STATUS", status} as const),
    setAppError: (error: string | null) => ({type: "TODO/APP/SET-ERROR", error} as const),
    abilityToAddTodoList: (ability: boolean) => ({type: "TODO/APP/ABILITY-TO-ADD-TODOLIST", ability} as const),
};


// thunks


// types
export type InitialAppStateType = typeof initialState;
export type AppActionType = InferActionType<typeof actionsForApp>;
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type AppInitialStateType = {
    status: RequestStatusType
    error: string | null
    addingTodoList: boolean
};

