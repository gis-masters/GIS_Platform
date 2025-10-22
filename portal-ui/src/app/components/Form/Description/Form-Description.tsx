import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';
import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';

import './Form-Description.scss';

const cnFormDescription = cn('Form', 'Description');

export const FormDescription: FC<ChildrenProps> = ({ children }) => (
  <DescriptionMark className={cnFormDescription()}>{children}</DescriptionMark>
);
