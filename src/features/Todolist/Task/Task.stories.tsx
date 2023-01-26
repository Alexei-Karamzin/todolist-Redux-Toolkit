import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {action} from "@storybook/addon-actions";
import {Task} from "./Task";
import {v1} from "uuid";
import {TaskPriority} from "../../../api/tasks-api";
import {ReduxStoreProviderDecorator} from "../../../app/ReduxStoreProviderDecorator";

export default {
    title: 'TODOLIST/Task',
    component: Task,
    args: {
        todolistId: '1',
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
        removeTask: action('removeTask')
    },
    decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
export const TaskIsNotDoneStory = Template.bind({});

TaskIsDoneStory.args = {
    task: {
        id: v1(),
        title: 'HTML&CSS',
        description: '',
        todoListId: 'todolistId1',
        order: 0,
        status: 2,
        priority: TaskPriority.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
    }
};

TaskIsNotDoneStory.args = {
    task: {id: v1(),
        title: '2',
        description: '',
        todoListId: 'todolistId1',
        order: 0,
        status: 1,
        priority: TaskPriority.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
    }
};