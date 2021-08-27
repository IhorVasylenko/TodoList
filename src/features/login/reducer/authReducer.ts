import {authAPI, LoginType} from "../../../api/todoListAPI";
import {setAppStatus, ThunkType} from "../../../app/reducer/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatchType} from "../../../app/store";
import {clearData} from "../../TodoListsList/reducers/todoListsReducer";


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
export const login = (data: LoginType): ThunkType => async (dispatch: AppDispatchType) => {
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

export const logout = (): ThunkType => async (dispatch: AppDispatchType) => {
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