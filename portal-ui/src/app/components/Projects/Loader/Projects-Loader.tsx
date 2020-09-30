import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Loading } from '../../Loading/Loading';

const cnProjectsLoader = cn('Projects', 'Loader');

export const ProjectsLoader: FC = () => <Loading className={cnProjectsLoader()} noBackdrop={false} />;
