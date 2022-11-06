import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
    title: 'TODOLIST/AddItemForm',
    component: AddItemForm,
    argTypes: {
        addItem: {description: 'callback'}
    },
    args: {

    }
} as ComponentMeta<typeof AddItemForm>;

const asyncCallback = async (...params: any[]) => {
    action('button inside form clicked')(...params)
}

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
    addItem: asyncCallback
};

export const AddItemFormDisableStory = Template.bind({});

AddItemFormDisableStory.args = {
    addItem: asyncCallback,
    disabled: true
};
