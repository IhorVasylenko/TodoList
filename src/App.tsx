import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksType = {
    id: string
    isDone: boolean
    title: string
}
export type TaskStateType= {
    [key: string] : Array<TasksType>
}



function App() {
// BL:
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListId_1, title: 'What to learn', filter: 'all'},
        {id: todoListId_2, title: 'What to buy', filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListId_1]: [
            {id: v1(), isDone: false, title: 'HTML'},
            {id: v1(), isDone: false, title: 'CSS'},
            {id: v1(), isDone: false, title: 'React'}
        ],
        [todoListId_2]: [
            {id: v1(), isDone: false, title: 'Beer'},
            {id: v1(), isDone: false, title: 'Water'},
            {id: v1(), isDone: false, title: 'Milk'}
        ],
    })



    const removeTask = (taskId: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].filter(task => task.id !== taskId)
        setTasks({...tasks})
        //setTasks({...tasks, tasks[todoListId].filter(task => task.id !== taskId)})
    }

    const addTask = (title: string, todoListId: string) => {
        const newTask: TasksType = {
            id: v1(),
            title,
            isDone: false
        }
        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]] })
    }

    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map(t => t.id === taskId ? {...t, isDone: newIsDoneValue} : t)
        setTasks({...tasks})
        //setTasks({...tasks, [todoListId]: tasks[todoListId].map(t => t.id === taskId ? {...t, isDone: newIsDoneValue} : t) })
    }

    const changeFilter = (value: FilterValuesType, todoListId: string) => {
        setTodoLists(todoLists.map( tl => tl.id === todoListId ? {...tl, filter: value} : tl) )
    }

    const removeTodoList = (todoListId: string) => {
        setTodoLists((todoLists.filter(tl => tl.id !== todoListId)))
        delete tasks[todoListId]
    }

    const addTodoList = (title: string) => {
        const newTodoListId = v1()
        const newTodoList: TodoListType = {id: newTodoListId, title, filter: 'all'}
        setTodoLists([newTodoList, ...todoLists])
        setTasks({...tasks, [newTodoListId]: []})
    }

    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map(t => t.id === taskId ? {...t, title} : t)
        setTasks({...tasks})
    }

    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map( tl => tl.id === todoListId ? {...tl, title} : tl) )
    }


// UI:
    const getTaskForTodoList = (todoList: TodoListType) => {
        switch (todoList.filter) {
            case "active":
                return tasks[todoList.id].filter(task => !task.isDone)
            case "completed":
                return tasks[todoList.id].filter(task => task.isDone)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListsComponents = todoLists.map(tl => {
            return (
                <TodoList
                    key={tl.id}
                    todoListId={tl.id}
                    title={tl.title}
                    filter={tl.filter}
                    removeTask={removeTask}
                    addTask={addTask}
                    changeFilter={changeFilter}
                    changeTaskStatus={changeTaskStatus}
                    tasks={getTaskForTodoList(tl)}
                    removeTodoList={removeTodoList}
                    changeTaskTitle={changeTaskTitle}
                    changeTodoListTitle={changeTodoListTitle}
                />
            )
        }
    )


    return (
        <div className="App">
            <AddItemForm addItem={addTodoList} />
            {todoListsComponents}
        </div>
    )
}

export default App;