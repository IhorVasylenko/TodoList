import {actionsForTasks, tasksReducer} from "./tasksReducer";
import {TasksStateType} from "../App";
import {actionsForTodoLists} from "./todoListsReducer";

let startState: TasksStateType

beforeEach( () => {
    startState = {
        "todolistId1": [
        { id: "1", title: "CSS", isDone: false },
        { id: "2", title: "JS", isDone: true },
        { id: "3", title: "React", isDone: false }
    ],
        "todolistId2": [
        { id: "1", title: "bread", isDone: false },
        { id: "2", title: "milk", isDone: true },
        { id: "3", title: "tea", isDone: false }
    ]
    }
})

test('correct task should be deleted from correct array', () => {
    const action = actionsForTasks.removeTask("2", "todolistId2")

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "3", title: "tea", isDone: false }
        ]
    })
})

test('correct task should be added to correct array', () => {
    const action = actionsForTasks.addTask("juice", "todolistId2")

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(4)
    expect(endState["todolistId2"][0].id).toBeDefined()
    expect(endState["todolistId2"][0].title).toBe("juice")
    expect(endState["todolistId2"][0].isDone).toBe(false)
})

test('status of specified task should be changed', () => {

    const action = actionsForTasks.changeTaskStatus("2", false, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].isDone).toBe(true)
    expect(endState["todolistId2"][1].isDone).toBe(false)
})

test('title of specified task should be changed', () => {
    const action = actionsForTasks.changeTaskTitle("3", "HTML", "todolistId1");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][2].title).toBe("HTML")
    expect(endState["todolistId2"][2].title).toBe("tea")
})

test('new array should be added when new todolist is added', () => {
    const action = actionsForTodoLists.addTodoList("new todolist")

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const action = actionsForTodoLists.removeTodoList("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

