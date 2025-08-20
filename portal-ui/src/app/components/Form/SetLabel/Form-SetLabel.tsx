import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Form-SetLabel.scss';

const cnFormSetLabel = cn('Form', 'SetLabel');

export const FormSetLabel: FC<ChildrenProps> = ({ children }) => <div className={cnFormSetLabel()}>{children}</div>;
