import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "../../../../api/todoListAPI";
import {TaskDomainType} from "../../tasksReducer";


export const Task: React.FC<TaskPropsType> = React.memo((props) => {

    const {
        changeTaskStatus,
        changeTaskTitle,
        removeTask,
        task,
        todoListId,
    } = props;

    const removeTaskFn = useCallback(
        () => removeTask(task.id, todoListId),
        [removeTask, task.id, todoListId]);

    const onChengStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todoListId);

    const changeTaskTitleFn = useCallback(
        (title: string) => changeTaskTitle(task.id, title, todoListId),
        [changeTaskTitle, task.id, todoListId]);

    return (
        <div key={task.id}>
            <Checkbox
                color={"default"}
                checked={task.status === TaskStatuses.Completed}
                onChange={onChengStatusHandler}
                disabled={task.entityStatus === "loading"}
            />
            <span className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
                    <EditableSpan
                        title={task.title}
                        changeTitle={changeTaskTitleFn}
                        disabled={task.entityStatus === "loading"}
                    />
                    </span>
            <IconButton onClick={removeTaskFn} style={{opacity: ".7"}} disabled={task.entityStatus === "loading"}>
                <Delete />
            </IconButton>
        </div>
    );
});


// types
export type TaskPropsType = {
    todoListId: string
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    task: TaskDomainType
};