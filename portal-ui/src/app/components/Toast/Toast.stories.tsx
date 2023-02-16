import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from '../Button/Button';
import { Toast } from './Toast';

export default {
  title: 'Toast',
  component: Toast
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} className='ToastStoryButton' />;

export const Error = Template.bind({});
Error.args = {
  children: 'Error',
  color: 'error',
  onClick: () => {
    Toast.error({
      message: 'Произошла ошибка.',
      details: 'window.notExistFunction is not a function',
      source: 'http://localhost/fakeFileName.js',
      fileno: 13,
      columnNumber: 13
    });
  }
};
