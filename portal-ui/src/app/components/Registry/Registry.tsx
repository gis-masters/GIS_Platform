import React, { Component, type ReactNode } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { type PageOptions, SortOrder } from '../../services/models';
import { services } from '../../services/services';
import { type FilterQuery } from '../../services/util/filters/filters.models';
import { type SortParams } from '../../services/util/sortObjects';
import { XTable, type XTableProps } from '../XTable/XTable';
import { type XTableColumn } from '../XTable/XTable.models';

export interface RegistryProps<T> {
  id: string;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  defaultFilter?: FilterQuery;
  className?: string;
  secondarySortField?: keyof T;
  urlChangeEnabled?: boolean;
  customActionFirst?: boolean;
  inDialog?: boolean;
  filtersAlwaysEnabled?: boolean;
  showFiltersPanel?: boolean;
  counter?: ReactNode;
  onSelect?(items: T[]): void;
  onPageOptionsChange?(pageOptions: PageOptions): void;
  setPageOptions?(pageOptions: PageOptions): void;
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
  headerActions?: ReactNode;
  invoke?: {
    reload?(): Promise<void>;
    reset?(opts?: Partial<PageOptions>): void;
    paginate?(page: number): void;
    setPageSize?(size: number): void;
    setFilter?(filter: FilterQuery): void;
    setSort?(sort: SortParams<T>): void;
  };
}

@observer
export class Registry<T> extends Component<RegistryProps<T>> {
  private defaultFilter: FilterQuery = {};
  private urlSort?: SortParams<T>;
  private urlPageSize?: number;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private tableInvoke: XTableProps<T>['invoke'] = {};
  private selfInitedNavigationIds: number[] = [];

  constructor(props: RegistryProps<T>) {
    super(props);
    makeObservable(this);

    this.setDefaultFilter();
    this.setUrlSort();
    this.setUrlPageSize();
  }

  componentDidMount() {
    if (this.props.invoke) {
      this.tableInvoke = this.props.invoke;
    }

    if (this.props.urlChangeEnabled) {
      services.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
        if (e instanceof NavigationEnd) {
          if (this.selfInitedNavigationIds.includes(e.id)) {
            this.selfInitedNavigationIds.splice(this.selfInitedNavigationIds.indexOf(e.id), 1);

            return;
          }

          const sort = this.getSortFromUrl();
          if (this.tableInvoke?.setSort && sort) {
            this.tableInvoke.setSort(sort);
          }

          const filter = this.getFilterFromUrl();
          if (this.tableInvoke?.setFilter && filter) {
            this.tableInvoke.setFilter(filter);
          }

          const pageSize = this.getPageSizeFromUrl();
          if (this.tableInvoke?.setPageSize && pageSize) {
            this.tableInvoke.setPageSize(pageSize);
          }
        }
      });
    }
  }

  render() {
    const {
      cols,
      id,
      getData,
      counter,
      defaultSort,
      className,
      inDialog,
      customActionFirst,
      headerActions,
      secondarySortField,
      invoke
    } = this.props;

    return (
      <XTable<T>
        className={className}
        cols={cols}
        id={id}
        getData={getData}
        counter={counter}
        defaultSort={this.urlSort || defaultSort}
        defaultPageSize={this.urlPageSize}
        filtersAlwaysEnabled
        showFiltersPanel
        customActionFirst={customActionFirst}
        secondarySortField={secondarySortField}
        defaultFilter={this.defaultFilter}
        invoke={invoke}
        onPageOptionsChange={inDialog ? undefined : this.handleTablePageOptionsChange}
        headerActions={headerActions}
      />
    );
  }

  @action.bound
  private handleTablePageOptionsChange(pageOptions: PageOptions) {
    if (this.props.setPageOptions) {
      this.props.setPageOptions(pageOptions);
    }

    if (this.props.onPageOptionsChange) {
      this.props.onPageOptionsChange(pageOptions);
    }

    const { sort, sortOrder: sortDir, filter, pageSize } = pageOptions;
    const encodedSort = JSON.stringify([sort, sortDir]);
    const encodedFilter = JSON.stringify(filter);

    services.ngZone.run(() => {
      void services.router.navigate([location.pathname], {
        queryParams: {
          sort: encodedSort,
          filter: encodedFilter,
          pageSize: pageSize === undefined ? undefined : String(pageSize)
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      const currentNavigation = services.router.getCurrentNavigation();
      if (currentNavigation) {
        this.selfInitedNavigationIds.push(currentNavigation.id);
      }
    });
  }

  private getQueryParam(name: string): string | null {
    const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    if (!match?.[1]) {
      return null;
    }

    const raw = match[1].replaceAll('+', ' ');
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  private getSortFromUrl(): SortParams<T> | undefined {
    try {
      const queryParamsSort = this.getQueryParam('sort');
      const sort = queryParamsSort && (JSON.parse(queryParamsSort) as string[]);

      if (sort) {
        return { field: sort[0] as keyof T, asc: sort[1] === SortOrder.ASC };
      }
    } catch {
      services.logger.warn('Не удалось восстановить параметры сортировки из url');
    }
  }

  private getFilterFromUrl(): FilterQuery | undefined {
    try {
      const queryParamsFilter = this.getQueryParam('filter');
      if (queryParamsFilter) {
        return JSON.parse(queryParamsFilter) as FilterQuery;
      }
    } catch {
      services.logger.warn('Не удалось восстановить параметры фильтрации из url');
    }
  }

  @action.bound
  private setDefaultFilter() {
    if (this.props.defaultFilter) {
      this.defaultFilter = this.props.defaultFilter;
    }

    const filter = this.getFilterFromUrl();

    if (this.props.urlChangeEnabled && filter) {
      this.defaultFilter = filter;
    }
  }

  private setUrlSort() {
    if (!this.props.urlChangeEnabled) {
      return;
    }

    this.urlSort = this.getSortFromUrl();
  }

  private getPageSizeFromUrl(): number | undefined {
    const raw = this.getQueryParam('pageSize');
    if (!raw) {
      return;
    }

    const size = Number(raw);
    if (Number.isInteger(size) && size > 0) {
      return size;
    }
  }

  private setUrlPageSize() {
    if (!this.props.urlChangeEnabled) {
      return;
    }

    this.urlPageSize = this.getPageSizeFromUrl();
  }
}
