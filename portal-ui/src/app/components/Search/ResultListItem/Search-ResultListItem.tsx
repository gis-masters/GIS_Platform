import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { MyLocation } from '@material-ui/icons';
import React, { Component, ReactNode } from 'react';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';

import { YaGeoObject } from '../../../services/yandex-geocode.service';
import { yaMapDecorator } from '../../../services/open-layer/ya-map-decorator.service';

const cnSearch = cn('Search');

export interface SearchResultListItemProps {
  geoObject: YaGeoObject;
  onClick: () => void;
}

@observer
export class SearchResultListItem extends Component<SearchResultListItemProps> {

  constructor(props: SearchResultListItemProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render(): ReactNode {
    const { name, description, Point } = this.props.geoObject;

    return (
      <ListItem key={Point.pos} className={cnSearch('ResultListItem')}>
        <ListItemText className={cnSearch('PrimaryText')}
          primary={name}
          secondary={description}
        />
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={this.clickHandler}>
            <MyLocation />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  private clickHandler() {
    this.props.onClick();

    const { lowerCorner, upperCorner } = this.props.geoObject.boundedBy.Envelope;
    const lowerSplited = lowerCorner.split(' ');
    const upperSplited = upperCorner.split(' ');

    yaMapDecorator.fitToBbox([Number(lowerSplited[0]), Number(lowerSplited[1]),
                              Number(upperSplited[0]), Number(upperSplited[1])], [0, 0, 0, 0]);
  }

}
