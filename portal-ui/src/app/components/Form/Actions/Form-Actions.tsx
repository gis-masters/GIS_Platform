import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Form-Actions.scss';

const cnFormActions = cn('Form', 'Actions');
export const FormActions: FC<ChildrenProps> = ({ children }) => <div className={cnFormActions()}>{children}</div>;
