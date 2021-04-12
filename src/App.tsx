import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";

export type TasksType = {
    id: string
    isDone: boolean
    title: string
}

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    const [tasks, setTasks] = useState<Array<TasksType>>([
        {id: v1(), isDone: true, title: 'HTML'},
        {id: v1(), isDone: false, title: 'CSS'},
        {id: v1(), isDone: true, title: 'React'},
        {id: v1(), isDone: false, title: 'Beer'},
        {id: v1(), isDone: true, title: 'Water'},
        {id: v1(), isDone: false, title: 'Milk'}
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')

    const removeTask = (taskId: string) => {
        const filteredTasks = tasks.filter(task => task.id !== taskId)
        setTasks((filteredTasks))
    }

    const addTask = (title: string) => {
        const newTask: TasksType = {
            id: v1(),
            title,
            isDone: false
        }
        setTasks([newTask, ...tasks])
    }

    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    const getTaskForTodoList = () => {
        switch (filter) {
            case "active":
                return tasks.filter(task => !task.isDone)
            case "completed":
                return tasks.filter(task => task.isDone)
            default:
                return tasks
        }
    }

    return (
        <div className="App">
            <TodoList title={'What to need'} tasks={getTaskForTodoList()} removeTask={removeTask}
                      changeFilter={changeFilter} addTask={addTask}/>
        </div>
    )
}

export default App;