import { createTheme } from '@mui/material/styles';
import type { Modifier } from '@popperjs/core';

const aboveToast: Modifier<'aboveToast', Record<string, never>> = {
  name: 'aboveToast',
  enabled: true,
  phase: 'write',
  fn({ state }) {
    const anchor = state.elements.reference;
    const inToast = anchor instanceof Element && anchor.closest('.Toastify__toast-container');
    state.elements.popper.style.zIndex = inToast ? 'calc(var(--toastify-z-index, 9999) + 1)' : '';
  }
};

export const toastTooltipTheme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        slotProps: {
          popper: {
            popperOptions: {
              modifiers: [aboveToast]
            }
          }
        }
      }
    }
  }
});
