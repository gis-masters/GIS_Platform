import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './ToolbarDivider.scss';

const cnToolbarDivider = cn('ToolbarDivider');

export const ToolbarDivider: FC = () => <div className={cnToolbarDivider()} />;
