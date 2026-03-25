import React, { type FC } from 'react';
import { DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type AnswerModalInfo } from '../../../stores/AnswerModals.store';

export const cnAnswerModalContent = cn('AnswerModal', 'Content');

export interface AnswerModalContentProps extends IClassNameProps {
  info: AnswerModalInfo;
  type: AnswerModalInfo['type'];
  formId: string;
}

export const AnswerModalContentBase: FC<AnswerModalContentProps> = ({ info: { message }, className }) => (
  <DialogContent className={cnAnswerModalContent(null, [className])}>{message}</DialogContent>
);
