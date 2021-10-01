import {changeTodoListFilter, FilterValuesType, TodoListDomainType,
    todoListsReducer, updateTodoListEntityStatus} from "./todoLists-reducer";
import {v1} from "uuid";
import {RequestStatusType} from "../../../app/reducer/app-reducer";
import {removeTodoList, fetchTodoLists, changeTodoListTitle, addTodoList} from "./actions/todoLists-actions";


let todoListId1: string;
let todoListId2: string;
let startState: Array<TodoListDomainType>;

beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();
    startState = [
        {id: todoListId1, title: "What to learn", filter: "all", order: 0, addedDate: '', entityStatus: "idle",},
        {id: todoListId2, title: "What to buy", filter: "all", order: 0, addedDate: '', entityStatus: "idle",}
    ];
});


test("correct todolist should be removed", () => {
    const endState = todoListsReducer(startState, removeTodoList.fulfilled(todoListId1, "requestId", todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
})

test("correct todolist should be added", () => {
    let newTodoList: TodoListDomainType = {
        title: "New title",
        id: "1",
        order: 1,
        filter: "all",
        addedDate: "",
        entityStatus: "idle",
    };

    const endState = todoListsReducer(
        startState,
        addTodoList.fulfilled(newTodoList, "requestId", "newTodoList"
        ));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoList.title);
});

test("correct todolist should change its name", () => {
    let title: string = "New Todolist";

    let updateModule = {id: todoListId2, title};
    const endState = todoListsReducer(
        startState,
        changeTodoListTitle.fulfilled(updateModule, "requestId", updateModule
        ));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(title);
});

test("correct filter of todolist should be changed", () => {
    let filter: FilterValuesType = "completed";

    const endState = todoListsReducer(startState, changeTodoListFilter({todoListId: todoListId2, filter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(filter);
});

test("todoLists should be set to the state", () => {

    const action = fetchTodoLists.fulfilled(startState, "requestId");
    const endState = todoListsReducer([], action);

    expect(endState.length).toBe(2);
});

test("correct entity status of todolist should be changed", () => {
    let entityStatus: RequestStatusType = "loading";

    const endState = todoListsReducer(startState, updateTodoListEntityStatus({
        todoListId: todoListId2,
        entityStatus
    }));

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(entityStatus);
});



