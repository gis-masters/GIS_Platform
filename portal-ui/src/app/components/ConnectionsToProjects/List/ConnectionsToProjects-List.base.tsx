import { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type FileConnection } from '../../../services/data/files/files.models';
import { type ConnectionsToProjectsType } from '../ConnectionsToProjects';

export const cnConnectionsToProjectsList = cn('ConnectionsToProjects', 'List');

export interface ConnectionsToProjectsListProps {
  connections?: FileConnection[];
  type: ConnectionsToProjectsType;
}

export const ConnectionsToProjectsListBase: FC<ConnectionsToProjectsListProps> = () => null;
