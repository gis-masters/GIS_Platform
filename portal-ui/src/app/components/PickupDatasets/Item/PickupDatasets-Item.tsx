import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { pluralize } from 'numeralize-ru';

import { Button } from '../../Button/Button';
import { Dataset } from '../../../services/data/data.service';

import '!style-loader!css-loader!sass-loader!./PickupDatasets-Item.scss';

const cnPickupDatasetsItem = cn('PickupDatasets', 'Item');

export interface PickupDatasetsItemProps {
  item: Dataset;
  onClick: (dataset: Dataset) => void;
}

@observer
export class PickupDatasetsItem extends Component<PickupDatasetsItemProps> {
  render() {
    const { item } = this.props;

    return (
      <ListItem className={cnPickupDatasetsItem()} button key={item.identifier}>
        <ListItemText
          primary={item.title}
          secondary={`${item.itemsCount} ${pluralize(item.itemsCount, 'таблица', 'таблицы', 'таблиц')}`}
        />
        <ListItemSecondaryAction>
          <Button onClick={this.onSelect} color='primary' variant='outlined' size='small'>
            Выбрать
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  @boundMethod
  private onSelect() {
    this.props.onClick(this.props.item);
  }
}
