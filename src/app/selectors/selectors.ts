import {AppRootStateType} from "../store";
import {RequestStatusType} from "../reducer/app-reducer";


export const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status;
export const selectAddingTodoList = (state: AppRootStateType): boolean => state.app.addingTodoList;
export const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized;
export const selectError = (state: AppRootStateType): string | null => state.app.error;