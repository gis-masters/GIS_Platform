import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';
import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';

import './Card-Help.scss';

const cnCardHelp = cn('Card', 'Help');

export const CardHelp: FC<ChildrenProps> = ({ children }) => (
  <DescriptionMark className={cnCardHelp()}>{children}</DescriptionMark>
);
