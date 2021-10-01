import {TaskPriorities, TaskStatuses, TaskType} from "../../../api/todoList-API";
import {RequestStatusType} from "../../../app/reducer/app-reducer";
import {clearData} from "./todoLists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeTask, fetchTask, modernizeTask, addTask} from "./actions/tasks-actions";
import {removeTodoList, fetchTodoLists, addTodoList} from "./actions/todoLists-actions";


const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        updateTaskEntityStatus(state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodoList.fulfilled, (state, action) => {
                state[action.payload.id] = [];
            })
            .addCase(removeTodoList.fulfilled, (state, action) => {
                delete state[action.payload];
            })
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                action.payload.forEach(tl => state[tl.id] = []);
            })
            .addCase(clearData, (state) => {
                return state = {} as TasksStateType;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}));
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todoListId];
                    // @ts-ignore
                    const index = tasks.findIndex(t => t.id === action.payload.taskId);
                    if (index > -1) {
                        tasks.splice(index, 1);
                    }
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
            })
            .addCase(modernizeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model};
                }
            })
    },
});

export const tasksReducer = slice.reducer;
export const {updateTaskEntityStatus} = slice.actions;


// types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
};
export type TasksStateType = {
    [key: string]: TaskDomainType[]
};
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
};




