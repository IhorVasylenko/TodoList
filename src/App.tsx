import React from 'react';
import './App.css';
import {TodoList} from "./TodoList";

export type TasksType = {
    id: number
    isDone: boolean
    title: string
}

function App () {
    const tasks1: Array<TasksType> = [
        {id: 0, isDone: true, title: 'HTML'},
        {id: 1, isDone: false, title: 'CSS'},
        {id: 2, isDone: true, title: 'React'}
    ]
    const tasks2: Array<TasksType> = [
        {id: 4, isDone: false, title: 'Beer'},
        {id: 5, isDone: true, title: 'Water'},
        {id: 6, isDone: false, title: 'Milk'}
    ]

    return (
        <div className="App">
            <TodoList title={'What to learn'} tasks={tasks1} />
            <TodoList title={'What to buy'} tasks={tasks2} />
        </div>
    );
}

export default App;