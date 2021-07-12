import { Dispatch } from 'redux';
import {actionsForApp} from "../app/appReducer";
import {CommonActionTypeForApp} from "../app/store";
import {ResponseType} from "../api/todoListAPI";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<CommonActionTypeForApp>) => {
    if (data.messages.length) {
        dispatch(actionsForApp.setAppError(data.messages[0]));
    } else {
        dispatch(actionsForApp.setAppError('Some error occurred'));
    }
    dispatch(actionsForApp.setAppStatus('failed'));
};

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch<CommonActionTypeForApp>) => {
    dispatch(actionsForApp.setAppError(error.message ? error.message : "Some error occurred"));
    dispatch(actionsForApp.setAppStatus('failed'));
};