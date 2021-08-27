import {AppDispatchType, AppRootStateType} from "./store";
import {authAPI} from "../api/todoListAPI";
import {ThunkAction} from "redux-thunk";
import {setIsLoggedIn} from "../features/login/authReducer";
import {Action, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    status: "idle",
    error: null,
    addingTodoList: false,
    isInitialized: false,
} as AppInitialStateType;

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<RequestStatusType>) {
            state.status = action.payload;
        },
        setAppError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        abilityToAddTodoList(state, action: PayloadAction<boolean>) {
            state.addingTodoList = action.payload;
        },
        setIsInitialized(state, action: PayloadAction<boolean>) {
            state.isInitialized = action.payload;
        },
    },
});

export const appReducer = slice.reducer;

export const {setAppStatus, setIsInitialized, abilityToAddTodoList, setAppError} = slice.actions;


// thunks
export const initializeApp = (): ThunkType => async (dispatch: AppDispatchType) => {
    try {
        let res = await authAPI.me();
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true));
            dispatch(setIsInitialized(true));
        }
    } finally {
        dispatch(setIsInitialized(true));
    }
};


// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = {
    status: RequestStatusType
    error: string | null
    addingTodoList: boolean
    isInitialized: boolean
};
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, Action<string>>;

