import {AppDispatchType} from "../app/store";
import {ResponseType} from "../api/todoList-API";
import {setAppError, setAppStatus} from "../app/reducer/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]));
    } else {
        dispatch(setAppError("Some error occurred"));
    }
    dispatch(setAppStatus("failed"));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatchType) => {
    dispatch(setAppError(error.message ? error.message : "Some error occurred"));
    dispatch(setAppStatus("failed"));
};