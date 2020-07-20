import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { TableCell, TableSortLabel, TableCellProps, TextField } from '@material-ui/core';

import { SortParams } from '../../services/util/sortObjects';
import { FilterParams } from '../../services/util/filterObjects';

import '!style-loader!css-loader!sass-loader!./TableHeadCell.scss';

const cnTableHeadCell = cn('TableHeadCell');

interface TableHeadCellProps<T> extends TableCellProps {
  field?: keyof T;
  sorting?: boolean;
  sortParams?: SortParams<T>;
  filtering?: boolean;
  filterParams?: FilterParams<T>;
}

@observer
export class TableHeadCell<T> extends Component<TableHeadCellProps<T>> {
  render() {
    const { field, sorting, sortParams, filtering, filterParams, children } = this.props;

    const cellProps = {
      ...this.props,
      className: cnTableHeadCell({ sorting, filtering }, [this.props.className])
    };
    delete cellProps.field;
    delete cellProps.sorting;
    delete cellProps.sortParams;
    delete cellProps.filtering;
    delete cellProps.filterParams;

    return (
      <TableCell {...cellProps}>
        {sorting ? (
          <TableSortLabel
            active={sortParams.field === field}
            direction={sortParams.asc || sortParams.field !== field ? 'asc' : 'desc'}
            onClick={this.handleSort}
          >
            {children}
          </TableSortLabel>
        ) : (
          children
        )}
        {filtering && (
          <TextField
            variant='filled'
            size='small'
            className={cnTableHeadCell('Filter')}
            onChange={this.handleFilterChange}
            value={filterParams[field] || ''}
          />
        )}
      </TableCell>
    );
  }

  @action.bound
  private handleSort() {
    const { field, sortParams } = this.props;

    if (sortParams.field !== field) {
      sortParams.field = field;
      sortParams.asc = true;
    } else {
      sortParams.asc = !sortParams.asc;
    }
  }

  @action.bound
  private handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterParams } = this.props;

    filterParams[field] = e.target.value;
  }
}
