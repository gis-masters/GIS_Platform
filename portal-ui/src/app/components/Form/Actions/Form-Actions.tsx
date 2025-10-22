import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Form-Actions.scss';

const cnFormActions = cn('Form', 'Actions');
export const FormActions: FC<ChildrenProps> = ({ children }) => <div className={cnFormActions()}>{children}</div>;
