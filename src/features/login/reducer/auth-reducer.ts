import {authAPI, FieldsErrorsType, LoginType} from "../../../api/todoList-API";
import {setAppStatus} from "../../../app/reducer/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearData} from "../../TodoListsList/reducers/todoLists-reducer";
import {AxiosError} from "axios";


export const login = createAsyncThunk<undefined, LoginType, {
    rejectValue: { errors: string[], fieldsErrors?: FieldsErrorsType[] }
}>("auth/login", async (data, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatus("loading"));
        const res = await authAPI.login(data);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("succeeded"));
            return;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (err) {
        const error: AxiosError = err;
        handleServerNetworkError(error, dispatch);
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }
});

export const logout = createAsyncThunk("auth/logout", async (data, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatus("loading"));
        const res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus("succeeded"));
            dispatch(clearData());
            return;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue({});
    }
});

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
            })
    },
});

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;