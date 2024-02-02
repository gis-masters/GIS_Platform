import React, { FC } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FileConnection } from '../../services/data/files/files.models';
import { getFeaturesUrl } from '../../services/map/map.util';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./FeaturesInProjects.scss';

export const cnFeaturesInProjects = cn('FeaturesInProjects');

interface FeaturesInProjectsProps {
  featureId: string;
  connections: FileConnection[];
}

export const FeatureInProjects: FC<FeaturesInProjectsProps> = ({ connections, featureId }) => {
  return (
    <List className={cnFeaturesInProjects()}>
      {connections.map(
        (connection, index: number) =>
          connection.layer?.dataset &&
          connection.layer.tableName && (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <Button
                    color='primary'
                    variant='text'
                    className={cnFeaturesInProjects('Button')}
                    href={getFeaturesUrl(connection.project.id, connection.layer.dataset, connection.layer.tableName, [
                      featureId
                    ])}
                  >
                    {connection.project.name}
                    <div className={cnFeaturesInProjects('IconWrapper')}>
                      Перейти
                      <MyLocation className={cnFeaturesInProjects('Icon')} />
                    </div>
                  </Button>
                }
                secondary={connection.layer && <>Слой: {connection.layer?.title}</>}
              />
            </ListItem>
          )
      )}
    </List>
  );
};
