import {authAPI, LoginType} from "../../api/todoListAPI";
import {setAppStatus, ThunkType} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "../../app/store";
import {clearData} from "../TodoListsList/todoListsReducer";


const initialState = {
    isLoggedIn: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload;
        },
    },
});

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;


// thunks
export const login = (data: LoginType): ThunkType => async (dispatch: AppDispatch) => {
    try {
        dispatch(setAppStatus("loading"));
        let res = await authAPI.login(data);
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true));
            dispatch(setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const logout = (): ThunkType => async (dispatch: AppDispatch) => {
    try {
        dispatch(setAppStatus("loading"));
        let res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(false));
            dispatch(setAppStatus("succeeded"));
            dispatch(clearData());
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};