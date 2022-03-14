import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FileIcon } from './FileIcon';

export default {
  title: 'FileIcon',
  component: FileIcon
} as ComponentMeta<typeof FileIcon>;

const Template: ComponentStory<typeof FileIcon> = args => <FileIcon {...args} />;

export const Filled = Template.bind({}) as ComponentStory<typeof FileIcon>;
Filled.args = {
  ext: 'TIF'
};

export const Outlined = Template.bind({}) as ComponentStory<typeof FileIcon>;
Outlined.args = {
  ext: 'PNG',
  outlined: true
};
