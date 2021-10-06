import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./DialogActionsLeft.scss';

const cnDialogActionsLeft = cn('DialogActionsLeft');

export const DialogActionsLeft: FC = ({ children }) => <div className={cnDialogActionsLeft()}>{children}</div>;
