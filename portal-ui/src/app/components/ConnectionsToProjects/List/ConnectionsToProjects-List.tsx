import { cn } from '@bem-react/classname';
import { FC } from 'react';

import { FileConnection } from '../../../services/data/files/files.models';

import { ConnectionsToProjectsType } from '../ConnectionsToProjects';

export const cnConnectionsToProjectsList = cn('ConnectionsToProjects', 'List');

interface ConnectionsToProjectsListProps {
  connections: FileConnection[];
  type: ConnectionsToProjectsType;
}

export const ConnectionsToProjectsList: FC<ConnectionsToProjectsListProps> = () => null;
