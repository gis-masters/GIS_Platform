import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import '../src/styles.css';
import { Toast } from '../src/app/components/Toast/Toast';

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

export const decorators = [
  Story => (
    <>
      <Story />
      <ToastContainer {...toastProps} />
    </>
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
