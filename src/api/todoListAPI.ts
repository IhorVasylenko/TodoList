import axios from "axios";


const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "api-key": "0590a1e8-ea10-4bc4-a086-b475e4beea64",
    },
});


type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
};

type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
};

export type UpdateTaskType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}

type ResponseType<D = {}> = {
    data: D
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
};


export const todoListAPI = {
    getTodoLists() {
        return instance.get<TodoListType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodoListType}>>('todo-lists', { title })
    },
    deleteTodolist(todoListId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}`)
    },
    updateTodolistTitle(todoListId: string, title: string) {
        return instance.put<ResponseType<{item: TodoListType}>>(`todo-lists/${todoListId}`, { title })
    },
    getTasks(todoListId: string) {
        return instance.get<ResponseType<TaskType[]>>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks`, { title })
    },
    deleteTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`)
    },
    updateTaskTitle(todoListId: string, taskId: string, updateTask: UpdateTaskType) {
        return instance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todoListId}/tasks/${taskId}`, { updateTask })
    },
};