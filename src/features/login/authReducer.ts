import {CommonActionTypeForApp, InferActionType} from "../../app/store";
import {authAPI, LoginType} from "../../api/todoListAPI";
import {actionsForApp, ThunkDispatchType, ThunkType} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState = {
    isLoggedIn: false
};

export const authReducer =
    (state: InitialAuthStateType = initialState, action: CommonActionTypeForApp): InitialAuthStateType => {
        switch (action.type) {
            case "TODO/LOGIN/SET-IS-LOGGED-IN":
                return {...state, isLoggedIn: action.value};
            default:
                return state;
        }
    };


// actions
export const actionsForAuth = {
    setIsLoggedIn: (value: boolean) => ({type: "TODO/LOGIN/SET-IS-LOGGED-IN", value} as const),
};


// thunks
export const login = (data: LoginType): ThunkType => async (dispatch: ThunkDispatchType) => {
    try {
        dispatch(actionsForApp.setAppStatus("loading"));
        let res = await authAPI.login(data);
        if (res.data.resultCode === 0) {
            dispatch(actionsForAuth.setIsLoggedIn(true))
            dispatch(actionsForApp.setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch);
    }
};

export const logout = (): ThunkType => async (dispatch: ThunkDispatchType) => {
    try {
        dispatch(actionsForApp.setAppStatus("loading"));
        let res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            dispatch(actionsForAuth.setIsLoggedIn(false))
            dispatch(actionsForApp.setAppStatus("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    }
};


// types
export type InitialAuthStateType = typeof initialState;
export type AuthActionType = InferActionType<typeof actionsForAuth>;