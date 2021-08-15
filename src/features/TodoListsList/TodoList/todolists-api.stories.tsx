import React, {useEffect, useState} from "react";
import {todoListAPI} from "../../../api/todoListAPI";


export default {
    title: "API"
};


export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        todoListAPI.getTodoLists()
            .then((res) => {
                setState(res.data);
            });
    }, []);
    return <div> {JSON.stringify(state)}</div>
};

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [todoListTitle, setTodoListTitle] = useState<string>('');
    const createTodoListTitleHandler = () => {
        todoListAPI.createTodolist(todoListTitle.toUpperCase())
            .then((res) => {
                setState(res.data);
                setTodoListTitle('');
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListTitle"}
                    value={todoListTitle}
                    onChange={e => setTodoListTitle(e.currentTarget.value)}/>
                <button onClick={createTodoListTitleHandler}>
                    create todoList
                </button>
            </div>
        </div>
    );
};

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [todoListId, setTodoListId] = useState<string>('');
    const deleteTodoListHandler = () => {
        todoListAPI.removeTodolist(todoListId)
            .then((res) => {
                setState(res.data);
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}
                />
                <button onClick={deleteTodoListHandler}>
                    delete todoLis
                </button>
            </div>
        </div>
    );
};

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [todoListId, setTodoListId] = useState<string>('');
    const [todoListTitle, setTodoListTitle] = useState<string>('');
    const updateTodoListTitleHandler = () => {
        todoListAPI.updateTodoListTitle(todoListId, todoListTitle.toUpperCase())
            .then((res) => {
                setState(res.data);
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}/>
                <input
                    placeholder={"todoListTitle"}
                    value={todoListTitle}
                    onChange={e => setTodoListTitle(e.currentTarget.value)}/>
                <button onClick={updateTodoListTitleHandler}>
                    update todoList title
                </button>
            </div>
        </div>
    );
};


export const GetTasks = () => {
    const [state, setState] = useState<any>(null);
    const [todoListId, setTodoListId] = useState<string>('');

    const getTasksHandler = () => {
        todoListAPI.getTasks(todoListId)
            .then((res) => {
                setState(res.data);
                setTodoListId("");
            })
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}/>
                <button onClick={getTasksHandler}>
                    get tasks
                </button>
            </div>
        </div>
    );
};

export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const [taskTitle, setTasTitle] = useState<string>('');
    const [todoListId, setTodoListId] = useState<string>('');

    const createTaskTitleHandler = () => {
        todoListAPI.createTask(todoListId, taskTitle.toUpperCase())
            .then((res) => {
                setState(res.data);
                setTasTitle('');
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}/>
                <input
                    placeholder={"taskTitle"}
                    value={taskTitle}
                    onChange={e => setTasTitle(e.currentTarget.value)}/>
                <button onClick={createTaskTitleHandler}>
                    create task
                </button>
            </div>
        </div>
    );
};

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null);
    const [taskId, setTaskId] = useState<string>('');
    const [todoListId, setTodoListId] = useState<string>('');

    const deleteTaskHandler = () => {
        todoListAPI.removeTask(todoListId, taskId)
            .then((res) => {
                setState(res.data);
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}/>
                <input
                    placeholder={"taskId"}
                    value={taskId}
                    onChange={e => setTaskId(e.currentTarget.value)}/>
                <button onClick={deleteTaskHandler}>
                    delete task
                </button>
            </div>
        </div>
    );
};

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null);
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');
    const [todoListId, setTodoListId] = useState<string>('');

    const updateTaskTitleHandler = () => {
        todoListAPI.updateTask(todoListId, taskId, {
            title: taskTitle.toUpperCase(),
            description: '',
            status: 0,
            priority: 0,
            startDate: '',
            deadline: '',
        })
            .then((res) => {
                setState(res.data);
            });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={"todoListId"}
                    value={todoListId}
                    onChange={e => setTodoListId(e.currentTarget.value)}/>
                <input
                    placeholder={"taskId"}
                    value={taskId}
                    onChange={e => setTaskId(e.currentTarget.value)}/>
                <input
                    placeholder={"taskTitle"}
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.currentTarget.value)}/>
                <button onClick={updateTaskTitleHandler}>
                    update task title
                </button>
            </div>
        </div>
    );
};
