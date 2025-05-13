import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Footer.scss';

const cnProjectFolderFooter = cn('ProjectFolder', 'Footer');

export const ProjectFolderFooter: FC = () => <div className={cnProjectFolderFooter()}>Открыть</div>;
