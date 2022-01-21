import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';

import '!style-loader!css-loader!sass-loader!./Form-Description.scss';

const cnFormDescription = cn('Form', 'Description');

export const FormDescription: FC = ({ children }) => (
  <DescriptionMark className={cnFormDescription()}>{children}</DescriptionMark>
);
