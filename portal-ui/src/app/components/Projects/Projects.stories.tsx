import React from 'react';
import { type Meta, type StoryFn } from '@storybook/react';

import { Projects } from './Projects';

import './Projects.stories.scss';

export default {
  title: 'Projects',
  component: Projects
} as Meta<typeof Projects>;

const Template: StoryFn<typeof Projects> = args => <Projects {...args} />;

export const Regular = Template.bind({});
Regular.args = {};
