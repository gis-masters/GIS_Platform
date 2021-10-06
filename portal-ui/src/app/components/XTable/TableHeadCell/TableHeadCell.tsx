import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { TableCell, TableSortLabel, TableCellProps, TextField } from '@mui/material';

import { SortParams } from '../../../services/util/sortObjects';
import { FilterParams } from '../../../services/util/filterObjects';

import '!style-loader!css-loader!sass-loader!./TableHeadCell.scss';

const cnTableHeadCell = cn('TableHeadCell');

interface TableHeadCellProps<T> extends TableCellProps {
  field?: keyof T;
  sorting?: boolean;
  sortParams?: SortParams<T>;
  filtering?: boolean;
  filterParams?: FilterParams<T>;
  headerCellProps?: TableCellProps;
  onBeforeFilterChange: () => void;
  onFilterChange: () => void;
}

@observer
export class TableHeadCell<T> extends Component<TableHeadCellProps<T>> {
  render() {
    const { field, sorting, sortParams, filtering, filterParams, children, headerCellProps, className } = this.props;

    const cellProps = {
      ...headerCellProps,
      ...this.props,
      className: cnTableHeadCell({ sorting, filtering }, [className])
    };

    delete cellProps.field;
    delete cellProps.sorting;
    delete cellProps.filtering;
    delete cellProps.sortParams;
    delete cellProps.filterParams;
    delete cellProps.headerCellProps;
    delete cellProps.onFilterChange;
    delete cellProps.onBeforeFilterChange;

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
    const { field, filterParams, onBeforeFilterChange, onFilterChange } = this.props;
    onBeforeFilterChange();
    filterParams[field] = e.target.value;
    onFilterChange();
  }
}
