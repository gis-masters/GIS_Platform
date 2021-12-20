import React, { Component, ComponentType, createRef, ReactNode, RefObject } from 'react';
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, debounce } from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  Pagination
} from '@mui/material';

import { filterObjects, FilterQuery } from '../../services/util/filterObjects';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { PropertyOption } from '../../services/crg/schema.models';
import { PageOptions, SortDir } from '../../services/models';
import { Highlight } from '../Highlight/Highlight';
import { TextBadge } from '../TextBadge/TextBadge';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';

import { XTableEmpty } from './Empty/XTable-Empty';
import { XTableTitle } from './Title/XTable-Title';
import { FilterType } from './Filter/XTable-Filter';
import { XTableHeadCell } from './HeadCell/XTable-HeadCell';
import { XTableHeader } from './Header/XTable-Header';
import { XTableFooter } from './Footer/XTable-Footer';
import { XTableContainer } from './Container/XTable-Container';
import { XTableHeaderActions } from './HeaderActions/XTable-HeaderActions';

import '!style-loader!css-loader!sass-loader!./XTable.scss';

const cnXTable = cn('XTable');

export interface XTableColumn<T> {
  title?: ReactNode;
  field?: keyof T;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: PropertyOption[];
  sortable?: boolean;
  CellContent?: ComponentType<{ rowData: T; field: keyof T; filterActive: boolean; filterParams: FilterQuery }>;
  getIdBadge?: (rowData: T) => string | number;
  cellProps?: TableCellProps;
  headerCellProps?: TableCellProps;
  align?: TableCellProps['align'];
}

interface XTablePropsBase<T> extends IClassNameProps {
  title?: ReactNode;
  headerActions?: ReactNode;
  headless?: boolean;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  filterable?: boolean;
  defaultFilter?: FilterQuery;
  filtersAlwaysEnabled?: boolean;
  onFilter?(filtered: T[]): void;
  onPageOptionsChange?(pageOptions: PageOptions): void;
  getRowId?(rowData: T): string | number;
  invoke?: {
    reload?(): void;
  };
}

interface XTablePropsSync<T> extends XTablePropsBase<T> {
  data: T[];
}

interface XTablePropsAsync<T> extends XTablePropsBase<T> {
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
}

export type XTableProps<T> = XTablePropsSync<T> | XTablePropsAsync<T>;

@observer
export class XTable<T> extends Component<XTableProps<T>> {
  @observable private sortParams: SortParams<T>;
  @observable private filterQuery: FilterQuery;
  @observable private filterActive = false;
  @observable private _page = 1;
  @observable private _asyncData: T[] = [];
  @observable private _asyncTotalPages = 0;
  @observable private tableMinHeight = 0;
  @observable private pageSize = 20;
  @observable private busy = false;

  private fetchingOperationId: symbol;
  private tableRef: RefObject<HTMLDivElement> = createRef();
  private pageOptionsReactionDisposer: IReactionDisposer;
  private pagedDataReactionDisposer: IReactionDisposer;

  constructor(props: XTableProps<T>) {
    super(props);
    this.sortParams = props.defaultSort || { field: null, asc: true };
    if (props.filtersAlwaysEnabled) {
      this.filterActive = true;
    }
    this.filterQuery = props.defaultFilter || {};
  }

  componentDidMount() {
    const { onPageOptionsChange, invoke } = this.props;

    if (invoke) {
      invoke.reload = this.fetchAsyncData;
    }

    this.pageOptionsReactionDisposer = reaction(
      () => [{ ...this.sortParams }, { ...this.filterQuery }, this.filterActive, this.pageSize, this.page],
      debounce(() => {
        void this.fetchAsyncData();
        if (onPageOptionsChange) {
          onPageOptionsChange(this.pageOptions);
        }
      }, 200),
      { fireImmediately: true }
    );

    this.pagedDataReactionDisposer = reaction(
      () => cloneDeep(this.dataPaged),
      debounce(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100)
    );
  }

  componentWillUnmount() {
    this.pageOptionsReactionDisposer();
    this.pagedDataReactionDisposer();
  }

  render() {
    const { cols, filterable, filtersAlwaysEnabled, title, headerActions, headless, className, getRowId } = this.props;

    return (
      <div className={cnXTable(null, [className, 'scroll'])}>
        <XTableHeader>
          <XTableTitle>{title}</XTableTitle>
          <XTableHeaderActions
            filterActive={this.filterActive || filtersAlwaysEnabled}
            filterable={filterable && !filtersAlwaysEnabled}
            onToggleFilter={this.toggleFilter}
            onChangePageSize={this.pageSizeChangeHandler}
            pageSize={this.pageSize}
          >
            {headerActions}
          </XTableHeaderActions>
        </XTableHeader>
        <TableContainer minHeight={this.tableMinHeight} containerRef={this.tableRef} component={XTableContainer}>
          <Table stickyHeader>
            {!headless && (
              <TableHead>
                <TableRow>
                  {cols.map(
                    (
                      {
                        field,
                        title,
                        sortable,
                        filterable,
                        filterType = FilterType.STRING,
                        filterOptions,
                        align,
                        headerCellProps
                      },
                      i
                    ) => (
                      <XTableHeadCell
                        key={`${i}_${String(field)}`}
                        field={field}
                        sortable={sortable}
                        sortParams={this.sortParams}
                        filterQuery={this.filterQuery}
                        filterable={filterable && this.filterActive && filterable}
                        filterType={filterType}
                        filterOptions={filterOptions}
                        align={align}
                        headerCellProps={headerCellProps}
                        onBeforeFilterChange={this.beforeFilterChange}
                        onFilterChange={this.afterFilterChange}
                      >
                        {title}
                      </XTableHeadCell>
                    )
                  )}
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {this.empty ? (
                <XTableEmpty colsCount={cols.length} busy={this.busy} />
              ) : (
                this.dataPaged.map((rowData, i) => (
                  <TableRow key={getRowId ? getRowId(rowData) : i} hover>
                    {cols.map(({ field, CellContent, getIdBadge, cellProps, align }, i) => (
                      <TableCell key={`${i}_${String(field)}`} align={align} {...(cellProps || {})}>
                        {CellContent ? (
                          <CellContent
                            rowData={rowData}
                            field={field}
                            filterActive={this.filterActive}
                            filterParams={this.filterQuery}
                          />
                        ) : (
                          <>
                            <Highlight
                              word={this.filterQuery[field as string]}
                              enabled={(filterable && this.filterActive) || filtersAlwaysEnabled}
                            >
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
        {this.paginationEnabled && (
          <XTableFooter>
            <Pagination count={this.totalPages} page={this.page} onChange={this.handlePagination} />
          </XTableFooter>
        )}
        <Loading noBackdrop visible={this.busy} />
      </div>
    );
  }

  @computed
  private get isAsync(): boolean {
    const { getData } = this.props as XTablePropsAsync<T>;

    return Boolean(getData);
  }

  @computed
  private get syncData(): T[] {
    const { field, asc } = this.sortParams;
    const { filterable, secondarySortField, filtersAlwaysEnabled } = this.props;
    let { data } = this.props as XTablePropsSync<T>;

    if ((filterable && this.filterActive) || filtersAlwaysEnabled) {
      data = filterObjects(data, this.filterQuery);
    }

    return field ? sortObjects(data, field, asc, secondarySortField) : data;
  }

  @computed
  private get dataPaged(): T[] {
    if (this.isAsync) {
      return this._asyncData;
    }

    return this.syncData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  @computed
  private get empty(): boolean {
    return this.isAsync ? !this._asyncData.length : !this.syncData.length;
  }

  @computed
  private get page(): number {
    return Math.min(this._page, this.totalPages || 1);
  }

  @computed
  private get totalPages(): number {
    return this.isAsync ? this._asyncTotalPages : Math.ceil(this.syncData.length / this.pageSize);
  }

  @computed
  private get paginationEnabled(): boolean {
    return this.totalPages > 1;
  }

  @computed
  private get pageOptions(): PageOptions {
    const { filterable, filtersAlwaysEnabled } = this.props;

    return {
      page: this.page - 1,
      pageSize: this.pageSize,
      sort: this.sortParams.field as string,
      sortDir: this.sortParams.asc ? SortDir.ASC : SortDir.DESC,
      filter: (filterable && this.filterActive) || filtersAlwaysEnabled ? this.filterQuery : {}
    };
  }

  @action.bound
  private toggleFilter() {
    this.filterActive = !this.filterActive;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown>, value: number) {
    this._page = value;
  }

  @action.bound
  private beforeFilterChange() {
    if (this.dataPaged.length === this.pageSize || !this.tableMinHeight) {
      this.tableMinHeight = this.tableRef?.current?.offsetHeight;
    }
  }

  @action.bound
  private afterFilterChange() {
    if (!this.isAsync) {
      const { data } = this.props as XTablePropsSync<T>;

      if (this.dataPaged.length === this.pageSize || this.syncData === data) {
        this.tableMinHeight = 0;
      }

      const { onFilter } = this.props;
      if (onFilter) {
        onFilter(this.syncData);
      }
    } else {
      this.tableMinHeight = 0;
    }
  }

  @action
  private setAsyncData(data: T[], totalPages: number) {
    this._asyncData = data;
    this._asyncTotalPages = totalPages;
  }

  @action.bound
  private pageSizeChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    this.pageSize = Number(e.target.value);
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private async fetchAsyncData() {
    if (!this.isAsync) {
      return;
    }
    this.setBusy(true);
    const { getData } = this.props as XTablePropsAsync<T>;
    const operationId = Symbol();
    this.fetchingOperationId = operationId;

    try {
      const [data, totalPages] = await getData(this.pageOptions);

      if (this.fetchingOperationId === operationId) {
        this.setAsyncData(data, totalPages);
      }
    } catch (error) {
      console.error(error);
      Toast.error('Ошибка получения данных');
    } finally {
      this.setBusy(false);
    }
  }
}
