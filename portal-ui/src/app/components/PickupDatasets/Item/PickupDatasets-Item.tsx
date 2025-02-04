import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItemButton, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { Dataset } from '../../../services/data/vectorData/vectorData.models';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./PickupDatasets-Item.scss';

const cnPickupDatasetsItem = cn('PickupDatasets', 'Item');

export interface PickupDatasetsItemProps {
  item: Dataset;
  onClick(dataset: Dataset): void;
}

@observer
export class PickupDatasetsItem extends Component<PickupDatasetsItemProps> {
  render() {
    const { item } = this.props;

    return (
      <ListItemButton className={cnPickupDatasetsItem()} key={item.identifier}>
        <ListItemText
          primary={item.title}
          secondary={`${item.itemsCount} ${pluralize(item.itemsCount || 0, 'таблица', 'таблицы', 'таблиц')}`}
        />
        <ListItemSecondaryAction>
          <Button onClick={this.onSelect} color='primary' variant='outlined' size='small'>
            Выбрать
          </Button>
        </ListItemSecondaryAction>
      </ListItemButton>
    );
  }

  @boundMethod
  private onSelect() {
    this.props.onClick(this.props.item);
  }
}
