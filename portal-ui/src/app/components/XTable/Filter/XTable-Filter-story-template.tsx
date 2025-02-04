import React from 'react';
import { StoryFn } from '@storybook/react';

import { XTable } from '../XTable';

export const Template: StoryFn<typeof XTable> = args => (
  <div style={{ width: '200px' }}>
    <XTable {...args} />
  </div>
);

export const TemplateWide: StoryFn<typeof XTable> = args => (
  <div style={{ width: '300px' }}>
    <XTable {...args} />
  </div>
);
