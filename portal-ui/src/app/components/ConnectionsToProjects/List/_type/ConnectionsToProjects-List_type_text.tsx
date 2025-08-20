import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { FileConnection } from '../../../../services/data/files/files.models';
import { Link } from '../../../Link/Link';
import { cnConnectionsToProjectsList } from '../ConnectionsToProjects-List.base';

interface ConnectionsToProjectsListProps {
  connections?: FileConnection[];
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
