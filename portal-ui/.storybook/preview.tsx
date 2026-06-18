import React from 'react';
import { withRegistry } from '@bem-react/di';
import type { Decorator } from '@storybook/react';
import { toast, ToastContainer } from 'react-toastify';
import '@angular/compiler';

import { AnswerModalsRoot } from '../src/app/components/AnswerModalsRoot/AnswerModalsRoot';
import { GlobalLoading } from '../src/app/components/GlobalLoading/GlobalLoading';
import { LoginFormDialog } from '../src/app/components/LoginFormDialog/LoginFormDialog';
import { Toast } from '../src/app/components/Toast/Toast';
import { registry } from '../src/app/services/di-registry';
import { StoryWrapper } from './StoryWrapper/StoryWrapper';

import '../src/styles.css';

const toastProps = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: Toast.defaultDuration,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: false,
  rtl: false,
  pauseOnVisibilityChange: false,
  draggable: false,
  pauseOnHover: true
};

const StoryWrapperWithRegistry = withRegistry(registry)(StoryWrapper);

const withProviders: Decorator = Story => (
  <StoryWrapperWithRegistry>
    <Story />
    <LoginFormDialog />
    <ToastContainer {...toastProps} />
    <AnswerModalsRoot />
    <GlobalLoading />
  </StoryWrapperWithRegistry>
);

export const decorators: Decorator[] = [withProviders];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
