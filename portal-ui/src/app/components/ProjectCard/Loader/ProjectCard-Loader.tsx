import * as React from 'react';
import { cn } from '@bem-react/classname';

import { Loading } from '../../Loading/Loading';

const cnProjectCard = cn('ProjectCard');

export const ProjectCardLoader: React.FC<{}> = () => (
  <Loading className={cnProjectCard('Loader')} noBackdrop={true} />
);
