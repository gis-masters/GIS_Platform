import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { Chip, Tooltip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { makeObservable, observable } from 'mobx';

import { XTableColumn } from '../XTable';
import { cnXTableFilterPanelItem, XTableFilterPanelItem } from '../FilterPanelItem/XTable-FilterPanelItem';

import { FilterQuery } from '../../../services/util/filterObjects';
import { PropertyType } from '../../../services/data/schema.models';

import '!style-loader!css-loader!sass-loader!./XTable-FilterPanel.scss';

const cnXTableFilterPanel = cn('XTable', 'FilterPanel');

export interface XTableFilterPanelProps<T> {
  filterQuery: FilterQuery;
  cols: XTableColumn<T>[];
  onUpdateFilter: (filter: FilterQuery) => void;
  onBeforeFilterChange(): void;
  onFilterChange(): void;
}

@observer
export class XTableFilterPanel<T> extends Component<XTableFilterPanelProps<T>> {
  @observable updateFilters = false;

  constructor(props: XTableFilterPanelProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { filterQuery, cols, onUpdateFilter, onBeforeFilterChange, onFilterChange } = this.props;

    return (
      <div className={cnXTableFilterPanel()}>
        {!!Object.keys(filterQuery).length && (
          <Chip
            className={cnXTableFilterPanelItem()}
            color='secondary'
            label={
              <Tooltip title='Очистить все фильтры'>
                <Clear fontSize='small' />
              </Tooltip>
            }
            onClick={this.handleDeleteAll}
            variant='outlined'
            size='small'
          />
        )}

        {Object.keys(filterQuery).map((filter, i) => {
          const item = cols.find(col => col.field === filter && this.allowedToShow(col));

          return (
            item && (
              <XTableFilterPanelItem
                key={i}
                filter={filterQuery}
                col={item}
                onUpdateFilter={onUpdateFilter}
                onFilterChange={onFilterChange}
                onBeforeFilterChange={onBeforeFilterChange}
                updateFilters={this.updateFilters}
              />
            )
          );
        })}
      </div>
    );
  }

  @boundMethod
  private handleDeleteAll() {
    const { onBeforeFilterChange, onUpdateFilter, onFilterChange } = this.props;

    onUpdateFilter({});
    onBeforeFilterChange();
    onFilterChange();
  }

  private allowedToShow(item: XTableColumn<T>) {
    if (item.CustomFilterPanelItemComponent) {
      return true;
    }

    return !(
      item.type === PropertyType.BINARY ||
      item.type === PropertyType.FIAS ||
      item.type === PropertyType.LOOKUP ||
      item.type === PropertyType.CUSTOM ||
      item.type === PropertyType.URL
    );
  }
}
