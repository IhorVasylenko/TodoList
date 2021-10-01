import {AppRootStateType} from "../../app/store";
import {TodoListDomainType} from "./reducers/todoLists-reducer";
import {TasksStateType} from "./reducers/tasks-reducer";


export const selectTodoList = (state: AppRootStateType): TodoListDomainType[] => state.todoLists;
export const selectTask = (state: AppRootStateType): TasksStateType => state.tasks;