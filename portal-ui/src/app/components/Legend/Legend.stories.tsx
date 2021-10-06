import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import '../../../styles.css';

import { Legend } from './Legend';

export default {
  title: 'Example/Legend',
  component: Legend
} as ComponentMeta<typeof Legend>;

const Template: ComponentStory<typeof Legend> = args => <Legend {...args} />;

export const Simple = Template.bind({}) as ComponentStory<typeof Legend>;
Simple.args = {
  rules: []
};
