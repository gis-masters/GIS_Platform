import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './ChangePasswordForm-Title.scss';

const cnChangePasswordFormTitle = cn('ChangePasswordForm', 'Title');

export const ChangePasswordFormTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnChangePasswordFormTitle()}>{children}</div>
);
