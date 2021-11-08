import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-SetLabel.scss';

const cnFormSetLabel = cn('Form', 'SetLabel');

export const FormSetLabel: FC = ({ children }) => <div className={cnFormSetLabel()}>{children}</div>;
