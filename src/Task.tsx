import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TasksType} from "./App";

export type TaskPropsType = {
    todoListId: string,
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean, todoListId: string) => void,
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void,
    removeTask: (taskId: string, todoListId: string) => void,
    task: TasksType,
};

export const Task = React.memo((
    {
        changeTaskStatus,
        changeTaskTitle,
        removeTask,
        task,
        todoListId,
    }: TaskPropsType) => {
    const removeTaskFn = useCallback(
        () => removeTask(task.id, todoListId),
        [removeTask, task.id, todoListId]);
    const onChengStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
        changeTaskStatus(task.id, e.currentTarget.checked, todoListId);
    const changeTaskTitleFn = useCallback(
        (title: string) => changeTaskTitle(task.id, title, todoListId),
        [changeTaskTitle, task.id, todoListId]);

    return (
        <div key={task.id}>
            <Checkbox
                color={"default"}
                checked={task.isDone}
                onChange={onChengStatusHandler}
            />
            <span className={task.isDone ? 'is-done' : ''}>
                    <EditableSpan title={task.title} changeTitle={changeTaskTitleFn}/>
                    </span>
            <IconButton onClick={removeTaskFn} style={{opacity: ".7"}}>
                <Delete/>
            </IconButton>
        </div>
    );
})