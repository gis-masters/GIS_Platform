import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { Link } from '../../../Link/Link';
import { FileConnection } from '../../../../services/files.service';

import { cnConnectionsToProjectsList } from '../ConnectionsToProjects-List';

interface ConnectionsToProjectsListProps {
  connections: FileConnection[];
  className: string;
}

export const ConnectionsToProjectsList: FC<ConnectionsToProjectsListProps> = ({ connections, className }) => (
  <>
    {connections?.map((connection, index: number) => (
      <Link
        key={index}
        className={cnConnectionsToProjectsList(null, [className])}
        href={`/projects/${connection.project.id}/map`}
      >
        {connection.project.name}
      </Link>
    ))}
  </>
);

export const withTypeText = withBemMod<ConnectionsToProjectsListProps>(
  cnConnectionsToProjectsList(),
  { type: 'text' },
  () => props => <ConnectionsToProjectsList {...props} />
);
