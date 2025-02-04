import React, { FC } from 'react';
import { DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { UtilityDialogInfo } from '../../../stores/UtilityDialogs.store';

export const cnUtilityDialogContent = cn('UtilityDialog', 'Content');

export interface UtilityDialogContentProps extends IClassNameProps {
  info: UtilityDialogInfo;
  type: UtilityDialogInfo['type'];
  formId: string;
}

export const UtilityDialogContentBase: FC<UtilityDialogContentProps> = ({ info: { message }, className }) => (
  <DialogContent className={cnUtilityDialogContent(null, [className])}>{message}</DialogContent>
);
