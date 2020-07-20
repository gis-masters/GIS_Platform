import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Loading } from '../../Loading/Loading';

const cnProjectsListLoader = cn('ProjectsListLoader');

export const ProjectsListLoader: FC = () => <Loading className={cnProjectsListLoader()} noBackdrop={false} />;
