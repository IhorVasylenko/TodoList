import {actionsForTodoLists, TodoListDomainType, todoListsReducer} from "./todoListsReducer";
import {tasksReducer, TasksStateType} from "./tasksReducer";

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

    const action = actionsForTodoLists.createTodoList(newTodoList);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.todoList.id);
    expect(idFromTodoLists).toBe(action.todoList.id);
});

