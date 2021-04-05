import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";

export type TasksType = {
    id: number
    isDone: boolean
    title: string
}

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {

    const [tasks, setTasks] = useState<Array<TasksType>>([
        {id: 0, isDone: true, title: 'HTML'},
        {id: 1, isDone: false, title: 'CSS'},
        {id: 2, isDone: true, title: 'React'},
        {id: 3, isDone: false, title: 'Beer'},
        {id: 4, isDone: true, title: 'Water'},
        {id: 5, isDone: false, title: 'Milk'}
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')

    const removeTask = (taskId: number) => {
        const filteredTasks = tasks.filter(task => task.id !== taskId)
        setTasks((filteredTasks))
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
                      changeFilter={changeFilter}/>
        </div>
    );
}

export default App;