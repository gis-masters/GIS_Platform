import React from 'react';
import { PublishOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type Decorator, type StoryFn } from '@storybook/react';

import { IconButton } from './IconButton';

import './IconButton.stories.scss';

const cnIconButtonStory = cn('IconButtonStory');

export default {
  title: 'IconButton',
  component: IconButton
};

const withHeaderBackground: Decorator = Story => (
  <div className={cnIconButtonStory({ bg: 'header' })}>
    <Story />
  </div>
);

const Template: StoryFn<typeof IconButton> = args => (
  <IconButton {...args}>
    <PublishOutlined />
  </IconButton>
);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

export const Inherit = Template.bind({});
Inherit.args = {
  color: 'inherit'
};
Inherit.decorators = [withHeaderBackground];

export const InheritDisabled = Template.bind({});
InheritDisabled.args = {
  color: 'inherit',
  disabled: true
};
InheritDisabled.decorators = [withHeaderBackground];

export const Loading = Template.bind({});
Loading.args = {
  loading: true
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true
};

export const Small = Template.bind({});
Small.args = {
  size: 'small'
};
