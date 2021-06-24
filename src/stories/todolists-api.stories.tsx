import React, {useEffect, useState} from 'react';
import {todoListAPI, UpdateTaskType} from "../api/todoListAPI";


export default {
    title: 'API'
};


export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListAPI.getTodoLists()
            .then((res) => {
                setState(res.data);
            })
    }, []);
    return <div> {JSON.stringify(state)}</div>
};

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let title: string = "new todoList";
        todoListAPI.createTodolist(title)
            .then((res) => {
                setState(res.data);
            })
    }, []);
    return <div> {JSON.stringify(state)}</div>
};

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "0ab97c72-ecc0-48f8-b494-740415528a8f";
        todoListAPI.deleteTodolist(todoListId)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
};

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        let title: string = "update todoList title";
        todoListAPI.updateTodolistTitle(todoListId, title)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
};


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        todoListAPI.getTasks(todoListId)
            .then((res) => {
                setState(res.data);
            })
    }, []);
    return <div> {JSON.stringify(state)}</div>
};

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        let title: string = "new task";
        todoListAPI.createTask(todoListId, title)
            .then((res) => {
                setState(res.data);
            })
    }, []);
    return <div> {JSON.stringify(state)}</div>
};

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        let taskId: string = "6da07940-b2c3-4b16-be0e-240a0eb89f53";
        todoListAPI.deleteTask(todoListId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
};

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoListId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        let taskId: string = "b6d69c1e-5ec7-4021-b364-024fe9aa6a25";
        let updateTask: UpdateTaskType = {
            title: "update task title",
            description: "",
            completed: false,
            status: 0,
            priority: 0,
            startDate: "",
            deadline: "",
        };
        todoListAPI.updateTaskTitle(todoListId, taskId, updateTask)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
};
