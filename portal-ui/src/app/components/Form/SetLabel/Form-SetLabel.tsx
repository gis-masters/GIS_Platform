import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-SetLabel.scss';

const cnFormSetLabel = cn('Form', 'SetLabel');

interface FormSetLabelProps {
  children: ReactNode;
}

export const FormSetLabel: FC<FormSetLabelProps> = ({ children }) => <div className={cnFormSetLabel()}>{children}</div>;
