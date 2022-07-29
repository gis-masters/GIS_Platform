import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import { List, ListItem, ListItemText } from '@mui/material';

import { Link } from '../../../Link/Link';
import { FileConnection } from '../../../../services/files.service';

import { cnConnectionsToProjectsList } from '../ConnectionsToProjects-List';

interface ConnectionsToProjectsListProps {
  connections: FileConnection[];
  className: string;
}

export const ConnectionsToProjectsList: FC<ConnectionsToProjectsListProps> = ({ connections, className }) => (
  <List>
    {connections?.map((connection, index: number) => (
      <ListItem key={index}>
        <ListItemText
          primary={
            <Link
              className={cnConnectionsToProjectsList(null, [className])}
              href={`/projects/${connection.project.id}/map`}
            >
              {connection.project.name}
            </Link>
          }
          secondary={connection.layer && <>Слой: {connection.layer?.title}</>}
        />
      </ListItem>
    ))}
  </List>
);

export const withTypeList = withBemMod<ConnectionsToProjectsListProps>(
  cnConnectionsToProjectsList(),
  { type: 'list' },
  () => props => <ConnectionsToProjectsList {...props} />
);
