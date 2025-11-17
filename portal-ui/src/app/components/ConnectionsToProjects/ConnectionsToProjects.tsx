import React, { type FC } from 'react';
import { observer } from 'mobx-react';

import { type FileConnection } from '../../services/data/files/files.models';
import { ConnectionsToProjectsList } from './List/ConnectionsToProjects-List.composed';

import './ConnectionsToProjects.scss';

interface ConnectionsToProjectsProps {
  type: ConnectionsToProjectsType;
  connections?: FileConnection[];
}

export type ConnectionsToProjectsType = 'list' | 'text';

export const ConnectionsToProjects: FC<ConnectionsToProjectsProps> = observer(({ type, connections }) => (
  <ConnectionsToProjectsList connections={connections} type={type} />
));
