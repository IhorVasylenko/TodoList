import React from "react";
import {Meta, Story} from "@storybook/react";
import {App} from "../App";
import {ReduxStoreProviderDecorator} from "../../stories/ReduxStoreProviderDecorator";
import StoryRouter from "storybook-react-router";


export default {
    title: "TODOLIST/App",
    component: App,
    decorators: [ReduxStoreProviderDecorator, StoryRouter()],
} as Meta;

const Template: Story = () => <App demo={false}/>;

export const AppExample = Template.bind({});
AppExample.args = {};