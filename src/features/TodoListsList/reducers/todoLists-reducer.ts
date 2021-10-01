import {TodoListType} from "../../../api/todoList-API";
import {RequestStatusType} from "../../../app/reducer/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeTodoList, fetchTodoLists, changeTodoListTitle, addTodoList} from "./actions/todoLists-actions";


export const slice = createSlice({
    name: "todoLists",
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        changeTodoListFilter(state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].filter = action.payload.filter;
        },
        updateTodoListEntityStatus(state, action: PayloadAction<{
            todoListId: string,
            entityStatus: RequestStatusType
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId);
            state[index].entityStatus = action.payload.entityStatus;
        },
        clearData(state) {
            return state = [] as Array<TodoListDomainType>;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                return action.payload.map((tl) => ({...tl, filter: 'all', entityStatus: "idle"}));
            })
            .addCase(removeTodoList.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload);
                if (index > -1) {
                    state.splice(index, 1);
                }
            })
            .addCase(addTodoList.fulfilled, (state, action) => {
                state.unshift({...action.payload, filter: "all", entityStatus: "idle"});
            })
            .addCase(changeTodoListTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id);
                state[index].title = action.payload.title;
            })
    },
});

export const todoListsReducer = slice.reducer;

export const {clearData, updateTodoListEntityStatus, changeTodoListFilter,} = slice.actions;


// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
};