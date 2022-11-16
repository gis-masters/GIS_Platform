import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Projects } from './Projects';

import '!style-loader!css-loader!sass-loader!./Projects.stories.scss';

export default {
  title: 'Projects',
  component: Projects
} as ComponentMeta<typeof Projects>;

const Template: ComponentStory<typeof Projects> = args => <Projects {...args} />;

export const Regular = Template.bind({});
Regular.args = {};
