import React from 'react';
import { ComponentStory } from '@storybook/react';

import { XTable } from '../XTable';

export const Template: ComponentStory<typeof XTable> = args => (
  <div style={{ width: '200px' }}>
    <XTable {...args} />
  </div>
);

export const TemplateWide: ComponentStory<typeof XTable> = args => (
  <div style={{ width: '300px' }}>
    <XTable {...args} />
  </div>
);
