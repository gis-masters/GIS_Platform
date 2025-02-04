import '@angular/compiler';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { withRegistry } from '@bem-react/di';

import '../src/styles.css';
import { registry } from '../src/app/services/di-registry';
import { Toast } from '../src/app/components/Toast/Toast';
import { LoginFormDialog } from '../src/app/components/LoginFormDialog/LoginFormDialog';
import { UtilityDialogsRoot } from '../src/app/components/UtilityDialogsRoot/UtilityDialogsRoot';
import { StoryWrapper } from './StoryWrapper/StoryWrapper';

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

export const decorators = [
  Story => (
    <StoryWrapperWithRegistry>
      <Story />
      <LoginFormDialog />
      <ToastContainer {...toastProps} />
      <UtilityDialogsRoot />
    </StoryWrapperWithRegistry>
  )
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
