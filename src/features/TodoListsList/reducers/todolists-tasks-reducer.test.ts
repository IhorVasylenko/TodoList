import {TodoListDomainType, todoListsReducer} from "./todoLists-reducer";
import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {addTodoList} from "./actions/todoLists-actions";


test("ids should be equals", () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];
    let newTodoList: TodoListDomainType = {
        title: "New title",
        id: "1",
        order: 1,
        filter: "all",
        addedDate: "",
        entityStatus: "idle",
    };

    const action = addTodoList.fulfilled(newTodoList, "requestId", "newTodoList");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.id);
    expect(idFromTodoLists).toBe(action.payload.id);
});

