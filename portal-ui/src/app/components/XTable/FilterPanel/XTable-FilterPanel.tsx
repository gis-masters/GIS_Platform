import React, { Component } from 'react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Chip, Tooltip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../../services/data/schema/schema.models';
import { getFieldFilterPart } from '../../../services/util/filters/filters';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { cnXTableFilterPanelItem, XTableFilterPanelItem } from '../FilterPanelItem/XTable-FilterPanelItem';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-FilterPanel.scss';

const cnXTableFilterPanel = cn('XTable', 'FilterPanel');

export interface XTableFilterPanelProps<T> {
  filterQuery: FilterQuery;
  cols: XTableColumn<T>[];
  onUpdateFilter(filter: FilterQuery): void;
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
    const { filterQuery, onUpdateFilter, onBeforeFilterChange, onFilterChange } = this.props;

    return (
      <div className={cnXTableFilterPanel()}>
        {!!this.filteredColumns.length && (
          <Chip
            className={cnXTableFilterPanelItem({ clearAll: true })}
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

        {this.filteredColumns.map(col => {
          return (
            <XTableFilterPanelItem<T>
              key={col.field}
              filter={filterQuery}
              col={col}
              onUpdateFilter={onUpdateFilter}
              onFilterChange={onFilterChange}
              onBeforeFilterChange={onBeforeFilterChange}
              updateFilters={this.updateFilters}
            />
          );
        })}
      </div>
    );
  }

  @computed
  private get filteredColumns(): XTableColumn<T>[] {
    const { filterQuery, cols } = this.props;

    return cols.filter(
      col => col.field && getFieldFilterPart(filterQuery, col.field) !== undefined && this.allowedToShow(col)
    );
  }

  @boundMethod
  private handleDeleteAll() {
    const { onBeforeFilterChange, onUpdateFilter, onFilterChange } = this.props;

    onUpdateFilter({});
    onBeforeFilterChange();
    onFilterChange();
  }

  private allowedToShow(item: XTableColumn<T>): boolean {
    if (item.field === 'path' && item.type === PropertyType.CUSTOM) {
      return false;
    }

    return (
      Boolean(item.CustomFilterPanelItemComponent) ||
      !(
        item.type === PropertyType.BINARY ||
        item.type === PropertyType.LOOKUP ||
        item.type === PropertyType.CUSTOM ||
        item.type === PropertyType.URL
      )
    );
  }
}
