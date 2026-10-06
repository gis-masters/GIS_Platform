import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { withRegistry } from '@bem-react/di';
import type { Decorator, Preview } from '@storybook/react';
import { ToastContainer } from 'react-toastify';
import '@angular/compiler';

import { AnswerModalsRoot } from '../src/app/components/AnswerModalsRoot/AnswerModalsRoot';
import { GlobalLoading } from '../src/app/components/GlobalLoading/GlobalLoading';
import { LoginFormDialog } from '../src/app/components/LoginFormDialog/LoginFormDialog';
import { Toast } from '../src/app/components/Toast/Toast';
import { toastTooltipTheme } from '../src/app/components/Toast/toastTooltipTheme';
import { registry } from '../src/app/services/di-registry';
import { StoryWrapper } from './StoryWrapper/StoryWrapper';

import '../src/styles.css';

const toastProps = {
  position: 'top-right' as const,
  autoClose: Toast.defaultDuration,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: true,
  icon: false as const
};

const StoryWrapperWithRegistry = withRegistry(registry)(StoryWrapper);

const withProviders: Decorator = Story => (
  <StoryWrapperWithRegistry>
    <Story />
    <LoginFormDialog />
    <ThemeProvider theme={toastTooltipTheme}>
      <ToastContainer {...toastProps} />
    </ThemeProvider>
    <AnswerModalsRoot />
    <GlobalLoading />
  </StoryWrapperWithRegistry>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
