import {AppRootStateType} from "../store";
import {authAPI} from "../../api/todoListAPI";
import {ThunkAction} from "redux-thunk";
import {setIsLoggedIn} from "../../features/login/reducer/authReducer";
import {Action, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


export const initializeApp = createAsyncThunk("app/initializeApp", async (data, {dispatch}) => {
    try {
        let res = await authAPI.me();
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true));
        }
    } finally {

    }
});

const slice = createSlice({
    name: "app",
    initialState: {
        status: "idle",
        error: null,
        addingTodoList: false,
        isInitialized: false,
    } as AppInitialStateType,
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
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true;
            })
    },
});

export const appReducer = slice.reducer;

export const {setAppStatus, abilityToAddTodoList, setAppError} = slice.actions;


// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = {
    status: RequestStatusType
    error: string | null
    addingTodoList: boolean
    isInitialized: boolean
};
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, Action<string>>;

