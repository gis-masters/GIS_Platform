import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../services/models';

import './FormStoryActions.scss';

export const cnFormStoryActions = cn('FormStoryActions');

export const FormStoryActions: FC<ChildrenProps> = ({ children }) => (
  <div className={cnFormStoryActions()}>{children}</div>
);
