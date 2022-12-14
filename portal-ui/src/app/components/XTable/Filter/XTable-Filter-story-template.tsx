import React from 'react';
import { ComponentStory } from '@storybook/react';

import { XTable } from '../XTable';

export const Template: ComponentStory<typeof XTable> = args => (
  <div style={{ width: '200px' }}>
    <XTable {...args} />
  </div>
);
