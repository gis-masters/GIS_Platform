import React, { Component, ReactNode } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { Table, TableBody, TableCell, TableCellProps, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { filterObjects, FilterParams } from '../../services/util/filterObjects';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { FilterButton } from '../FilterButton/FilterButton';
import { Highlight } from '../Highlight/Highlight';
import { TextBadge } from '../TextBadge/TextBadge';

import { TableHeadCell } from './TableHeadCell/TableHeadCell';
import { XTableEmpty } from './Empty/XTable-Empty';
import { XTableTitle } from './Title/XTable-Title';
import { XTableHeader } from './Header/XTable-Header';
import { XTableHeaderActions } from './HeaderActions/XTable-HeaderActions';
import { XTableContainer } from './Container/XTable-Container';
import { XTableFooter } from './Footer/XTable-Footer';

import '!style-loader!css-loader!sass-loader!./XTable.scss';

const cnXTable = cn('XTable');

export interface XTableColumn<T> {
  title?: ReactNode;
  field?: keyof T;
  filtering?: boolean;
  sorting?: boolean;
  renderCellContent?: (rowData: T, filterActive: boolean, filterParams: FilterParams<T>) => ReactNode;
  getIdBadge?: (rowData: T) => string | number;
  cellProps?: TableCellProps;
  align?: TableCellProps['align'];
}

interface XTableProps<T> extends IClassNameProps {
  title?: ReactNode;
  headerActions?: ReactNode;
  headless?: boolean;
  data: T[];
  cols: XTableColumn<T>[];
  defaultSort: SortParams<T>;
  secondarySortField: keyof T;
  filterable?: boolean;
}

@observer
export class XTable<T> extends Component<XTableProps<T>> {
  @observable private sortParams: SortParams<T>;
  @observable private filterParams: FilterParams<T> = {};
  @observable private filterActive = false;
  @observable private _page = 1;
  private rowsPerPage = 20;

  constructor(props: XTableProps<T>) {
    super(props);
    this.sortParams = props.defaultSort;
  }

  render() {
    const { cols, filterable, title, headerActions, headless, className } = this.props;

    return (
      <div className={cnXTable(null, [className, 'scroll'])}>
        <XTableHeader>
          <XTableTitle>{title}</XTableTitle>
          <XTableHeaderActions>
            {headerActions}
            {filterable && <FilterButton filterActive={this.filterActive} onClick={this.toggleFilter} />}
          </XTableHeaderActions>
        </XTableHeader>
        <>
          <TableContainer component={XTableContainer}>
            <Table stickyHeader>
              {!headless && (
                <TableHead>
                  <TableRow>
                    {cols.map(({ field, title, sorting, filtering, align }, i) => (
                      <TableHeadCell
                        key={i}
                        field={field}
                        sorting={sorting}
                        sortParams={this.sortParams}
                        filterParams={this.filterParams}
                        filtering={filterable && this.filterActive && filtering}
                        align={align}
                      >
                        {title}
                      </TableHeadCell>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {!this.data.length ? (
                  <XTableEmpty colsCount={cols.length} />
                ) : (
                  this.dataPaged.map((rowData, i) => (
                    <TableRow key={i} hover>
                      {cols.map(({ field, renderCellContent, getIdBadge, cellProps, align }, i) => (
                        <TableCell key={i} align={align} {...(cellProps || {})}>
                          {renderCellContent ? (
                            renderCellContent(rowData, this.filterActive, this.filterParams)
                          ) : (
                            <>
                              <Highlight word={this.filterParams[field]} enabled={filterable && this.filterActive}>
                                {rowData[field] === null || rowData[field] === undefined ? '' : String(rowData[field])}
                              </Highlight>
                              {getIdBadge && <TextBadge id={getIdBadge(rowData)} />}
                            </>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {this.pagesCount > 1 && (
            <XTableFooter>
              <Pagination count={this.pagesCount} page={this.page} onChange={this.handlePagination} />
            </XTableFooter>
          )}
        </>
      </div>
    );
  }

  @computed
  private get data(): T[] {
    const { field, asc } = this.sortParams;
    const { filterable, secondarySortField } = this.props;
    let { data } = this.props;

    if (filterable && this.filterActive) {
      data = filterObjects(data, this.filterParams);
    }

    return sortObjects(data, field, asc, secondarySortField);
  }

  @computed
  private get dataPaged(): T[] {
    return this.data.slice((this.page - 1) * this.rowsPerPage, (this.page - 1) * this.rowsPerPage + this.rowsPerPage);
  }

  @computed
  private get page(): number {
    return Math.min(this._page, this.pagesCount);
  }

  @computed
  private get pagesCount(): number {
    return Math.ceil(this.data.length / this.rowsPerPage);
  }

  @action.bound
  private toggleFilter() {
    this.filterActive = !this.filterActive;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown>, value: number) {
    this._page = value;
  }
}
