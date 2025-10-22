import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Form-SetLabel.scss';

const cnFormSetLabel = cn('Form', 'SetLabel');

export const FormSetLabel: FC<ChildrenProps> = ({ children }) => <div className={cnFormSetLabel()}>{children}</div>;
