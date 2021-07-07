import axios from "axios";


// api
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "api-key": "0590a1e8-ea10-4bc4-a086-b475e4beea64",
    },
});

export const todoListAPI = {
    getTodoLists() {
        return instance.get<TodoListType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodoListType}>>('todo-lists', { title })
    },
    removeTodolist(todoListId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}`)
    },
    updateTodoListTitle(todoListId: string, title: string) {
        return instance.put<ResponseType<{item: TodoListType}>>(`todo-lists/${todoListId}`, { title })
    },
    getTasks(todoListId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks`, { title })
    },
    removeTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`)
    },
    updateTask(todoListId: string, taskId: string, updateTask: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todoListId}/tasks/${taskId}`, updateTask)
    },
};
/*return instance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks/${taskId}`, { updateTask })*/


// types
export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
};

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
};

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
};

type ResponseType<D = {}> = {
    data: D
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
};

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
};