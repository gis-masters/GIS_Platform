import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';

import '!style-loader!css-loader!sass-loader!./Form-Description.scss';

const cnFormDescription = cn('Form', 'Description');

export const FormDescription: FC<ChildrenProps> = ({ children }) => (
  <DescriptionMark className={cnFormDescription()}>{children}</DescriptionMark>
);
