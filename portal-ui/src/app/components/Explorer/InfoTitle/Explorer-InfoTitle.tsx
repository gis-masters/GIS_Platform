import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoTitle.scss';

const cnExplorerInfoTitle = cn('Explorer', 'InfoTitle');

export const ExplorerInfoTitle: FC = ({ children }) => <div className={cnExplorerInfoTitle()}>{children}</div>;
