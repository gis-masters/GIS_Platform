import React from 'react';
import { StoryFn } from '@storybook/react';

import { Button } from '../Button/Button';
import { Toast } from './Toast';

export default {
  title: 'Toast',
  component: Toast
};

const Template: StoryFn<typeof Button> = args => <Button {...args} className='ToastStoryButton' />;

export const Error = Template.bind({});
Error.args = {
  children: 'Error',
  color: 'error',
  onClick() {
    Toast.error({
      message: 'Произошла ошибка.',
      details: 'window.notExistFunction is not a function',
      source: 'http://localhost/fakeFileName.js',
      fileno: 13,
      columnNumber: 13
    });
  }
};
