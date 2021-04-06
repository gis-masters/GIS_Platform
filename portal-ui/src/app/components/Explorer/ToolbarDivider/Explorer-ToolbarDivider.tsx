import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarDivider.scss';

const cnExplorerToolbarDivider = cn('Explorer', 'ToolbarDivider');

export const ExplorerToolbarDivider: FC = () => <div className={cnExplorerToolbarDivider()} />;
