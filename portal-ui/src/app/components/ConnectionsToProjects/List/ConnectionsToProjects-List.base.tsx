import { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FileConnection } from '../../../services/data/files/files.models';
import { ConnectionsToProjectsType } from '../ConnectionsToProjects';

export const cnConnectionsToProjectsList = cn('ConnectionsToProjects', 'List');

export interface ConnectionsToProjectsListProps {
  connections?: FileConnection[];
  type: ConnectionsToProjectsType;
}

export const ConnectionsToProjectsListBase: FC<ConnectionsToProjectsListProps> = () => null;
