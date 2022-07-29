import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { FileConnection } from '../../../services/files.service';

import { ConnectionsToProjectsType } from '../ConnectionsToProjects';

export const cnConnectionsToProjectsList = cn('ConnectionsToProjects', 'List');

interface ConnectionsToProjectsListProps {
  connections: FileConnection[];
  type: ConnectionsToProjectsType;
}

export const ConnectionsToProjectsList: FC<ConnectionsToProjectsListProps> = () => null;
