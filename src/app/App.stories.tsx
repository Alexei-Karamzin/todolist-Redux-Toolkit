import React from 'react';
import { Meta, Story} from '@storybook/react';

import {App} from "./App";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";

export default {
    title: 'TODOLIST/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator],
} as Meta;

const Template: Story = () => <App demo={true}/>;

export const AppStory = Template.bind({});


