import React, { Component, createRef, ReactNode, RefObject } from 'react';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Pagination, PaperProps, Table, TableBody, TableContainer, TableRow } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, debounce } from 'lodash';

import { PageOptions, SortOrder } from '../../services/models';
import { filterObjects } from '../../services/util/filters/filterObjects';
import { getFieldFilterValue } from '../../services/util/filters/filters';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { currentUser } from '../../stores/CurrentUser.store';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';
import { XTableCell } from './Cell/XTable-Cell';
import { XTableContainer, XTableContainerProps } from './Container/XTable-Container';
import { XTableEmpty } from './Empty/XTable-Empty';
import { XTableFilterPanel } from './FilterPanel/XTable-FilterPanel';
import { XTableFooter } from './Footer/XTable-Footer';
import { XTableHead } from './Head/XTable-Head';
import { XTableHeadCell } from './HeadCell/XTable-HeadCell';
import { XTableRow } from './Row/XTable-Row';
import { XTableTitle } from './Title/XTable-Title';
import { XTableTitleBar } from './TitleBar/XTable-TitleBar';
import { XTableTitleBarActions } from './TitleBarActions/XTable-TitleBarActions';
import { colsTypesAlign, XTableColumn } from './XTable.models';
import { defaultRowIdGetter } from './XTable.utils';

import '!style-loader!css-loader!sass-loader!./XTable.scss';

const cnXTable = cn('XTable');

interface XTablePropsBase<T> extends IClassNameProps {
  id?: string;
  title?: ReactNode;
  headerActions?: ReactNode;
  headerless?: boolean;
  footerless?: boolean;
  showFiltersPanel?: boolean;
  enableMaxDefaultWidth?: boolean;
  counter?: ReactNode;
  customActionFirst?: boolean;
  size?: 'small' | 'medium';
  singleLineContent?: boolean;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  filterable?: boolean;
  loading?: boolean;
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

export type XTableInvoke = Required<XTableProps<unknown>>['invoke'];

export type XTableProps<T> = XTablePropsSync<T> | XTablePropsAsync<T>;

interface XTableColSettings {
  hidden?: boolean;
  width?: number;
}

type XTableColsSettings<T> = Partial<Record<keyof T, XTableColSettings>>;

@observer
export default class XTable<T> extends Component<XTableProps<T>> {
  @observable private sortParams: Partial<SortParams<T>> = {};
  @observable private filterQuery: FilterQuery = {};
  @observable private filterActive = true;
  @observable private _page = 1;
  @observable private _asyncData: T[] = [];
  @observable private _asyncTotalPages = 0;
  @observable private tableMinHeight = 0;
  @observable private pageSize = 20;
  @observable private busy = false;
  @observable private colsSettings: XTableColsSettings<T> = {};

  private fetchingOperationId?: symbol;
  private tableRef: RefObject<HTMLDivElement> = createRef();
  private pageOptionsReactionDisposer?: IReactionDisposer;
  private pagedDataReactionDisposer?: IReactionDisposer;

  constructor(props: XTableProps<T>) {
    super(props);
    makeObservable(this);

    this.reset();
    if (props.id) {
      this.restoreColsSettings(props.id);
    }
  }

  componentDidMount() {
    const { onPageOptionsChange } = this.props;

    this.fillInvoke();

    // Добавляем обработчик изменения ширины колонки
    window.addEventListener('columnWidthChange', this.handleColumnWidthChange as EventListener);

    this.pageOptionsReactionDisposer = reaction(
      () => [
        { ...this.sortParams },
        cloneDeep(this.filterQuery),
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

    if (id && id !== prevProps.id) {
      this.restoreColsSettings(id);
    }
  }

  componentWillUnmount() {
    this.clearInvoke();
    this.pageOptionsReactionDisposer?.();
    this.pagedDataReactionDisposer?.();
    window.removeEventListener('columnWidthChange', this.handleColumnWidthChange as EventListener);
  }

  render() {
    const {
      filterable,
      filtersAlwaysEnabled = true,
      title,
      headerActions,
      headerless,
      footerless,
      className,
      counter,
      size,
      loading = false,
      singleLineContent = false,
      enableMaxDefaultWidth = false,
      customActionFirst = false,
      containerProps,
      showFiltersPanel,
      getRowId = defaultRowIdGetter,
      onRowDoubleClick
    } = this.props;

    return (
      <div className={cnXTable(null, [className, 'scroll'])}>
        {!headerless && (
          <XTableTitleBar>
            {title && <XTableTitle>{title}</XTableTitle>}
            {counter}
            {showFiltersPanel && (
              <XTableFilterPanel
                filterQuery={this.filterQuery}
                cols={this.cols}
                onBeforeFilterChange={this.beforeFilterChange}
                onFilterChange={this.afterFilterChange}
                onUpdateFilter={this.setFilterQuery}
              />
            )}
            <XTableTitleBarActions
              filterActive
              filterable={Boolean(filterable && !filtersAlwaysEnabled)}
              onChangePageSize={this.setPageSize}
              onToggleFilter={this.toggleFilter}
              customActionFirst={customActionFirst}
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
          containerProps={containerProps || {}}
        >
          <Table stickyHeader size={size}>
            <XTableHead>
              <TableRow>
                {this.cols.map((col, i) => (
                  <XTableHeadCell
                    col={col}
                    width={this.getColWidth(col)}
                    hidden={this.colsSettings[col.field]?.hidden}
                    key={`${i}_${String(col.field)}`}
                    sortParams={this.sortParams}
                    filterActive={this.filterActive}
                    filterQuery={this.filterQuery}
                    enableMaxDefaultWidth={enableMaxDefaultWidth}
                    singleLineContent={singleLineContent}
                    onBeforeFilterChange={this.beforeFilterChange}
                    onFilterChange={this.afterFilterChange}
                    onWidthChange={this.changeColWidth}
                    align={col.align || (col.type && colsTypesAlign[col.type]) || undefined}
                  />
                ))}
              </TableRow>
            </XTableHead>

            <TableBody>
              {this.empty ? (
                <XTableEmpty colsCount={this.cols.length} busy={this.busy || loading} />
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
                        singleLineContent={Boolean(singleLineContent)}
                        width={this.getColWidth(col)}
                        enableMaxDefaultWidth={enableMaxDefaultWidth}
                        hidden={this.colsSettings[col.field]?.hidden}
                        key={`${i}_${String(col.field)}`}
                        align={col.align || (col.type && colsTypesAlign[col.type]) || undefined}
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
        <Loading noBackdrop visible={this.busy || loading} />
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
        !hidden || this.pageOptions.sort === field || getFieldFilterValue(this.pageOptions.filter || {}, field)
    );
  }

  @computed
  private get syncData(): T[] {
    const { filterable, secondarySortField, filtersAlwaysEnabled } = this.props;
    let { data } = this.props as XTablePropsSync<T>;

    if (data) {
      if ((filterable && this.filterActive) || filtersAlwaysEnabled) {
        data = filterObjects(data, this.filterQuery);
      }

      if (!this.sortParams?.field) {
        return data;
      }

      const { field, asc } = this.sortParams;

      return field ? sortObjects(data, field, !!asc, secondarySortField) : data;
    }

    return [];
  }

  @computed
  private get dataPaged(): T[] {
    return this.isAsync
      ? this._asyncData
      : this.syncData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  @boundMethod
  private handleColumnWidthChange(event: CustomEvent<{ field: keyof T; width: number }>) {
    const { field, width } = event.detail;
    this.changeColWidth(field, width);
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
    const { filtersAlwaysEnabled } = this.props;

    return {
      page: this.page - 1,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      sort: this.sortParams?.field as string,
      sortOrder: this.sortParams?.asc ? SortOrder.ASC : SortOrder.DESC,
      filter: filtersAlwaysEnabled ? this.filterQuery : {}
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
      this.tableMinHeight = this.tableRef?.current?.offsetHeight || 0;
    }
  }

  @action.bound
  private afterFilterChange() {
    if (this.isAsync) {
      this.tableMinHeight = 0;
    } else {
      const { data } = this.props as XTablePropsSync<T>;

      if (this.dataPaged.length === this.pageSize || this.syncData === data) {
        this.tableMinHeight = 0;
      }

      const { onFilter } = this.props;
      if (onFilter) {
        onFilter(this.syncData);
      }
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
      } catch {
        // do nothing
      }
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
      ...sortOpts,
      ...this.props.defaultSort
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

  private getColWidth(col: XTableColumn<T>) {
    // Используем только сохраненные значения ширины из localStorage или схемы
    return this.colsSettings[col.field]?.width || col.width || col.minWidth || undefined;
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

  private clearInvoke() {
    const { invoke } = this.props;

    if (invoke) {
      delete invoke.reload;
      delete invoke.reset;
      delete invoke.paginate;
      delete invoke.setPageSize;
      delete invoke.setFilter;
      delete invoke.setSort;
    }
  }
}
