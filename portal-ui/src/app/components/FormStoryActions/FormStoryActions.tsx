import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./FormStoryActions.scss';

export const cnFormStoryActions = cn('FormStoryActions');

export const FormStoryActions: FC<ChildrenProps> = ({ children }) => (
  <div className={cnFormStoryActions()}>{children}</div>
);
