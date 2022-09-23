import React, { Component, ComponentType, createRef, ReactElement, ReactNode, RefObject } from 'react';
import { action, computed, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Table, TableBody, TableCellProps, TableContainer, TableRow, Pagination, PaperProps } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cloneDeep, debounce } from 'lodash';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import {
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaUrl,
  PropertyType,
  Relation
} from '../../services/data/schema.models';
import { filterObjects, FilterQuery } from '../../services/util/filterObjects';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';

import { XTableRow } from './Row/XTable-Row';
import { XTableHead } from './Head/XTable-Head';
import { XTableCell } from './Cell/XTable-Cell';
import { XTableEmpty } from './Empty/XTable-Empty';
import { XTableTitle } from './Title/XTable-Title';
import { XTableFooter } from './Footer/XTable-Footer';
import { XTableFilterProps } from './Filter/XTable-Filter.base';
import { XTableTitleBar } from './TitleBar/XTable-TitleBar';
import { XTableHeadCell } from './HeadCell/XTable-HeadCell';
import { XTableContainer, XTableContainerProps } from './Container/XTable-Container';
import { XTableTitleBarActions } from './TitleBarActions/XTable-TitleBarActions';

import '!style-loader!css-loader!sass-loader!./XTable.scss';

const cnXTable = cn('XTable');

export function defaultRowIdGetter<T extends { id?: string | number; identifier?: string; name?: string }>({
  id,
  identifier,
  name
}: T): string | number {
  return id || identifier || name;
}

export interface XTableColumn<T> {
  field?: keyof T;
  title?: ReactNode;
  description?: ReactNode;
  filterable?: boolean;
  CustomFilterComponent?: ComponentType<XTableFilterProps>;
  type?: PropertyType;
  settings?: Partial<
    Pick<PropertySchemaChoice, 'options'> &
      Pick<PropertySchemaDatetime, 'format'> &
      Pick<PropertySchemaUrl, 'openIn'> & { relations: Relation[] }
  >;
  sortable?: boolean;
  CellContent?: ComponentType<{ rowData: T; field: keyof T; filterActive: boolean; filterParams: FilterQuery }>;
  AfterCellContent?: <T>(p: {
    rowData: T;
    col: XTableColumn<T>;
    filterActive: boolean;
    filterParams: FilterQuery;
  }) => ReactElement;
  getIdBadge?: (rowData: T) => string | number;
  cellProps?: TableCellProps;
  headerCellProps?: TableCellProps;
  align?: TableCellProps['align'];
  hidden?: boolean;
}

interface XTablePropsBase<T> extends IClassNameProps {
  id?: string;
  title?: ReactNode;
  headerActions?: ReactNode;
  headerless?: boolean;
  footerless?: boolean;
  size?: 'small' | 'medium';
  singleLineContent?: boolean;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  filterable?: boolean;
  defaultFilter?: FilterQuery;
  filtersAlwaysEnabled?: boolean;
  containerProps?: Partial<PaperProps & XTableContainerProps>;
  invoke?: {
    reload?(): Promise<void>;
    reset?(opts?: Partial<PageOptions>): void;
    paginate?(page: number): void;
    setPageSize?(size: number): void;
    setFilter?(filter: FilterQuery): void;
    setSort?(sort: SortParams<T>): void;
  };
  onFilter?(filtered: T[]): void;
  onPageOptionsChange?(pageOptions: PageOptions): void;
  onRowDoubleClick?(rowData: T): void;
  getRowId?(rowData: T): string | number;
}

interface XTablePropsSync<T> extends XTablePropsBase<T> {
  data: T[];
}

interface XTablePropsAsync<T> extends XTablePropsBase<T> {
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
}

export type XTableInvoke = XTableProps<unknown>['invoke'];

export type XTableProps<T> = XTablePropsSync<T> | XTablePropsAsync<T>;

interface XTableColSettings {
  hidden?: boolean;
  width?: number;
}

type XTableColsSettings<T> = Partial<Record<keyof T, XTableColSettings>>;

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
  @observable private colsSettings: XTableColsSettings<T> = {};

  private fetchingOperationId: symbol;
  private tableRef: RefObject<HTMLDivElement> = createRef();
  private pageOptionsReactionDisposer: IReactionDisposer;
  private pagedDataReactionDisposer: IReactionDisposer;

  constructor(props: XTableProps<T>) {
    super(props);
    makeObservable(this);

    this.reset();

    if (props.filtersAlwaysEnabled) {
      this.filterActive = true;
    }

    this.restoreColsSettings(props.id);
  }

  componentDidMount() {
    const { onPageOptionsChange } = this.props;

    this.fillInvoke();

    this.pageOptionsReactionDisposer = reaction(
      () => [
        { ...this.sortParams },
        { ...this.filterQuery },
        this.filterActive,
        this.page,
        this.pageSize,
        this.totalPages
      ],
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

  componentDidUpdate(prevProps: Readonly<XTableProps<T>>) {
    const { id, invoke } = this.props;

    if (invoke !== prevProps.invoke) {
      this.fillInvoke();
    }

    if (id !== prevProps.id) {
      this.restoreColsSettings(id);
    }
  }

  componentWillUnmount() {
    this.pageOptionsReactionDisposer();
    this.pagedDataReactionDisposer();
  }

  render() {
    const {
      filterable,
      filtersAlwaysEnabled,
      title,
      headerActions,
      headerless,
      footerless,
      className,
      size,
      singleLineContent,
      containerProps,
      getRowId = defaultRowIdGetter,
      onRowDoubleClick
    } = this.props;

    const colsTypesAlign: Partial<Record<PropertyType, TableCellProps['align']>> = {
      [PropertyType.BOOL]: 'center',
      [PropertyType.DATETIME]: 'center',
      [PropertyType.INT]: 'right',
      [PropertyType.FLOAT]: 'right'
    };

    return (
      <div className={cnXTable(null, [className, 'scroll'])}>
        {!headerless && (
          <XTableTitleBar>
            <XTableTitle>{title}</XTableTitle>
            <XTableTitleBarActions
              filterActive={this.filterActive || filtersAlwaysEnabled}
              filterable={filterable && !filtersAlwaysEnabled}
              onChangePageSize={this.setPageSize}
              onToggleFilter={this.toggleFilter}
              pageSize={this.pageSize}
            >
              {headerActions}
            </XTableTitleBarActions>
          </XTableTitleBar>
        )}
        <TableContainer
          minHeight={this.tableMinHeight}
          containerRef={this.tableRef}
          component={XTableContainer}
          containerProps={containerProps}
        >
          <Table stickyHeader size={size}>
            <XTableHead>
              <TableRow>
                {this.cols.map((col, i) => (
                  <XTableHeadCell
                    col={col}
                    width={this.colsSettings[col.field]?.width}
                    hidden={this.colsSettings[col.field]?.hidden}
                    key={`${i}_${String(col.field)}`}
                    sortParams={this.sortParams}
                    filterActive={this.filterActive}
                    filterQuery={this.filterQuery}
                    singleLineContent={singleLineContent}
                    onBeforeFilterChange={this.beforeFilterChange}
                    onFilterChange={this.afterFilterChange}
                    onWidthChange={this.changeColWidth}
                    align={col.align || colsTypesAlign[col.type]}
                  />
                ))}
              </TableRow>
            </XTableHead>

            <TableBody>
              {this.empty ? (
                <XTableEmpty colsCount={this.cols.length} busy={this.busy} />
              ) : (
                this.dataPaged.map((rowData, i) => (
                  <XTableRow
                    rowData={rowData}
                    key={getRowId ? getRowId(rowData) : i}
                    onRowDoubleClick={onRowDoubleClick}
                  >
                    {this.cols.map((col, i) => (
                      <XTableCell<T>
                        rowData={rowData}
                        col={col}
                        filterActive={(filterable && this.filterActive) || filtersAlwaysEnabled}
                        filterQuery={this.filterQuery}
                        singleLineContent={singleLineContent}
                        width={this.colsSettings[col.field]?.width}
                        hidden={this.colsSettings[col.field]?.hidden}
                        key={`${i}_${String(col.field)}`}
                        align={col.align || colsTypesAlign[col.type]}
                      />
                    ))}
                  </XTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!footerless && this.paginationEnabled && (
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
  private get cols(): XTableColumn<T>[] {
    const { cols } = this.props;

    return cols.filter(
      ({ field, hidden }) =>
        !hidden || this.pageOptions.sort === field || Object.keys(this.pageOptions.filter).includes(field as string)
    );
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
      totalPages: this.totalPages,
      sort: this.sortParams.field as string,
      sortOrder: this.sortParams.asc ? SortOrder.ASC : SortOrder.DESC,
      filter: (filterable && this.filterActive) || filtersAlwaysEnabled ? this.filterQuery : {}
    };
  }

  @action.bound
  private toggleFilter() {
    this.filterActive = !this.filterActive;
  }

  @action.bound
  private handlePagination(e: React.ChangeEvent<unknown> | null, value: number) {
    const { onPageOptionsChange } = this.props;
    this._page = value;
    if (onPageOptionsChange) {
      onPageOptionsChange(this.pageOptions);
    }
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
  private setPageSize(size: number) {
    this.pageSize = size;
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

  private getColsSettingsStorageKey(id: string): string {
    return `XTableColsSettings_${id}_${currentUser.id}`;
  }

  @action
  private restoreColsSettings(id: string) {
    if (id) {
      try {
        this.colsSettings = JSON.parse(
          localStorage.getItem(this.getColsSettingsStorageKey(id)) || '{}'
        ) as XTableColsSettings<T>;
      } catch {}
    }
  }

  private saveColsSettings() {
    const { id } = this.props;
    if (id) {
      localStorage.setItem(this.getColsSettingsStorageKey(id), JSON.stringify(this.colsSettings));
    }
  }

  private debouncedSaveColsSettings = debounce(this.saveColsSettings, 500);

  @action.bound
  private changeColWidth(col: keyof T, width: number) {
    this.colsSettings[col] = { ...this.colsSettings[col], width };
    this.debouncedSaveColsSettings();
  }

  @action.bound
  private reset(opts: Partial<PageOptions> = {}) {
    this._page = opts.page || 1;

    const sortOpts = { field: opts.sort as keyof T, asc: opts.sortOrder === SortOrder.ASC };
    this.sortParams = {
      field: null,
      asc: true,
      ...this.props.defaultSort,
      ...sortOpts
    };

    this.filterQuery = opts.filter || this.props.defaultFilter || {};
  }

  @action.bound
  private setFilterQuery(query: FilterQuery) {
    this.beforeFilterChange();
    this.filterQuery = query;
    this.afterFilterChange();
  }

  @action.bound
  private setSortParams(sort: SortParams<T>) {
    this.sortParams = sort;
  }

  private fillInvoke() {
    const { invoke } = this.props;

    if (invoke) {
      invoke.reload = this.fetchAsyncData;
      invoke.reset = this.reset;
      invoke.paginate = this.handlePagination.bind(this, null);
      invoke.setPageSize = this.setPageSize;
      invoke.setFilter = this.setFilterQuery;
      invoke.setSort = this.setSortParams;
    }
  }
}
