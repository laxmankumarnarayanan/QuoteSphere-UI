// src/stories/TextInput.stories.tsx
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextInput } from '../components';

export default {
  title: 'Components/TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Text Input',
  helperText: 'This is a helper text',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Text Input',
  error: 'This field is required',
};