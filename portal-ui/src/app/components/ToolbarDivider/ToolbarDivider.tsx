import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ToolbarDivider.scss';

const cnToolbarDivider = cn('ToolbarDivider');

export const ToolbarDivider: FC = () => <div className={cnToolbarDivider()} />;
