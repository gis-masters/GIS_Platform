import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-Actions.scss';

const cnFormActions = cn('Form', 'Actions');

export const FormActions: FC = ({ children }) => <div className={cnFormActions()}>{children}</div>;
