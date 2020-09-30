import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Projects-List.scss';

const cnProjectsList = cn('Projects', 'List');

export const ProjectsList: FC = ({ children }) => <div className={cnProjectsList()}>{children}</div>;
