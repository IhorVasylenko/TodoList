import {AddTodoListAC, ChangeTodoListFilterAC, ChangeTodoListTitleAC,
    RemoveTodoListAC, todoListsReducer} from './todolistsReducer';
import {v1} from 'uuid';
import {FilterValuesType, TodoListType} from '../App';

test('correct todolist should be removed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ]

    const endState = todoListsReducer(startState, RemoveTodoListAC(todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
})

test('correct todolist should be added', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let newTodoListTitle = "New Todolist";

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ]

    const endState = todoListsReducer(startState, AddTodoListAC(newTodoListTitle))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoListTitle);
})

test('correct todolist should change its name', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let newTodoListTitle: string = "New Todolist";

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ]


    const endState = todoListsReducer(startState, ChangeTodoListTitleAC(newTodoListTitle, todoListId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodoListTitle);
})

test('correct filter of todolist should be changed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: Array<TodoListType> = [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ]

    const endState = todoListsReducer(startState, ChangeTodoListFilterAC(newFilter, todoListId2));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
})



