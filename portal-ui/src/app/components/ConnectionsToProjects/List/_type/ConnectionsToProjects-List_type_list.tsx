import React, { FC } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { FileConnection } from '../../../../services/data/files/files.models';
import { Link } from '../../../Link/Link';
import { cnConnectionsToProjectsList } from '../ConnectionsToProjects-List.base';

import '!style-loader!css-loader!sass-loader!./ConnectionsToProjects-List_type_list.scss';

interface ConnectionsToProjectsListProps {
  connections?: FileConnection[];
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
