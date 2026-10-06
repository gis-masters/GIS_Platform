import React from 'react';
import { type StoryFn } from '@storybook/react';

import { Button } from '../Button/Button';
import { GpkgImportToast, type GpkgImportToastItem } from '../GpkgImportToast/GpkgImportToast';
import { GpkgImportToastDetails } from '../GpkgImportToastDetails/GpkgImportToastDetails';
import { Toast } from './Toast';

const tooltipItems: GpkgImportToastItem[] = [
  { id: '1', tableName: 'roads', features: 12, tiles: 0, status: 'running' },
  { id: '2', tableName: 'buildings', features: 4, tiles: 0, status: 'running' }
];

export default {
  title: 'Toast',
  component: Toast
};

const Template: StoryFn<typeof Button> = args => <Button {...args} className='ToastStoryButton' />;

export const ToastError = Template.bind({});
ToastError.args = {
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

export const ToastLoader = Template.bind({});
ToastLoader.args = {
  children: 'Loader',
  onClick() {
    Toast.show('Импорт…', {
      loader: true,
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false
    });
  }
};

export const ToastLoaderThenSuccess = Template.bind({});
ToastLoaderThenSuccess.args = {
  children: 'Loader → success',
  color: 'success',
  onClick() {
    const id = Toast.show('Импорт…', {
      loader: true,
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false
    });

    window.setTimeout(() => {
      Toast.update(id, 'Готово', { type: 'success', autoClose: Toast.defaultDuration });
    }, 2000);
  }
};

export const ToastWithTooltip = Template.bind({});
ToastWithTooltip.args = {
  children: 'With tooltip',
  onClick() {
    Toast.show({
      message: <GpkgImportToast items={tooltipItems} />,
      details: <GpkgImportToastDetails items={tooltipItems} />,
      autoClose: false
    });
  }
};

export const ToastLoaderThenError = Template.bind({});
ToastLoaderThenError.args = {
  children: 'Loader → error',
  color: 'error',
  onClick() {
    const id = Toast.show('Импорт…', {
      loader: true,
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false
    });

    window.setTimeout(() => {
      Toast.error('Не удалось', { toastId: id });
    }, 2000);
  }
};
