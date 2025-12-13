import React, { type FC, useCallback } from 'react';
import { Close } from '@mui/icons-material';
import { type Id, toast } from 'react-toastify';

import { IconButton } from '../../IconButton/IconButton';
import { cnToast } from '../Toast.classname';

export interface ToastCloseButtonProps {
  toastId: { id: Id };
}

export const ToastCloseButton: FC<ToastCloseButtonProps> = ({ toastId }) => {
  const handleClose = useCallback(() => {
    toast.dismiss(toastId.id);
  }, [toastId]);

  return (
    <IconButton type='button' className={cnToast('Close')} onClick={handleClose}>
      <Close className={cnToast('CloseIcon')} />
    </IconButton>
  );
};
