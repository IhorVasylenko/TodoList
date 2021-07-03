import {actionsForTasks, tasksReducer, TasksStateType} from "./tasksReducer";
import {actionsForTodoLists} from "./todoListsReducer";
import {TaskStatuses, TodoTaskPriority} from "../api/todoListAPI";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", completed: true,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", completed: true,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
        ],
    };
});

test('correct task should be deleted from correct array', () => {
    const action = actionsForTasks.removeTask("2", "todolistId2");

    const endState = tasksReducer(startState, action);

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", completed: true,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", completed: false,
                order: 0, priority: TodoTaskPriority.Low, description: '', addedDate: '', startDate: '', deadline: '',
            },
        ],
    });
});

test('correct task should be added to correct array', () => {
    const action = actionsForTasks.addTask("juice", "todolistId2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {

    const action = actionsForTasks.changeTaskStatus("2", TaskStatuses.New, "todolistId2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {
    const action = actionsForTasks.changeTaskTitle("3", "HTML", "todolistId1");

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][2].title).toBe("HTML");
    expect(endState["todolistId2"][2].title).toBe("tea");
});

test('new array should be added when new todolist is added', () => {
    const action = actionsForTodoLists.addTodoList("new todolist");

    const endState = tasksReducer(startState, action);


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = actionsForTodoLists.removeTodoList("todolistId2");

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

