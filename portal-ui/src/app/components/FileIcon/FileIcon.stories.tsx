import React from 'react';
import { StoryFn } from '@storybook/react';

import { FileIcon } from './FileIcon';

export default {
  title: 'FileIcon',
  component: FileIcon
};

const Template: StoryFn<typeof FileIcon> = args => <FileIcon {...args} />;

export const Filled = Template.bind({});
Filled.args = {
  ext: 'TIF'
};

export const Outlined = Template.bind({});
Outlined.args = {
  ext: 'PNG',
  outlined: true
};
