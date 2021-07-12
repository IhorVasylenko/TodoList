import React from 'react';
import {Meta, Story} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task, TaskPropsType} from "./Task";
import {TaskStatuses, TaskPriorities} from "../../../../api/todoListAPI";


export default {
    title: 'TODOLIST/Task',
    component: Task,
} as Meta;

const changeTaskStatusCallback = action('Status changed inside Task');
const changeTaskTitleCallback = action('Title changed inside Task');
const removeTaskCallback = action('Remove Button inside Task clicked');

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    changeTaskStatus: changeTaskStatusCallback,
    changeTaskTitle: changeTaskTitleCallback,
    removeTask: removeTaskCallback,
}

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    ...baseArgs,
    task: {id: '1',
        status: TaskStatuses.Completed,
        title: 'JS',
        priority: TaskPriorities.Later,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        todoListId: 'todoListId1',
        entityStatus: "idle",
    },
    todoListId: 'todoListId1',
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    ...baseArgs,
    task: {id: '2',
        status: TaskStatuses.New,
        title: 'CSS',
        priority: TaskPriorities.Later,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        todoListId: 'todoListId1',
        entityStatus: "idle",
    },
    todoListId: 'todoListId1',
};