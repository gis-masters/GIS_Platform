import React, { Component, ReactNode } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { XTable, XTableProps } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { FilterQuery } from '../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { SortParams } from '../../services/util/sortObjects';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';

export interface RegistryProps<T> {
  id: string;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  defaultFilter?: FilterQuery;
  className?: string;
  secondarySortField?: keyof T;
  urlChangeEnabled?: boolean;
  filtersAlwaysEnabled?: boolean;
  showFiltersPanel?: boolean;
  onSelect?: (items: T[]) => void;
  setPageOptions?: (pageOptions: PageOptions) => void;
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
export default class Registry<T> extends Component<RegistryProps<T>> {
  private defaultFilter: FilterQuery;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private tableInvoke: XTableProps<T>['invoke'] = {};
  private selfInitedNavigationIds: number[] = [];

  constructor(props: RegistryProps<T>) {
    super(props);
    makeObservable(this);

    this.setDefaultFilter();
  }

  componentDidMount() {
    if (this.props.invoke) {
      this.tableInvoke = this.props.invoke;
    }

    if (this.props.urlChangeEnabled) {
      services.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((e: RouterEvent) => {
        if (e instanceof NavigationEnd) {
          if (this.selfInitedNavigationIds.includes(e.id)) {
            this.selfInitedNavigationIds.splice(this.selfInitedNavigationIds.indexOf(e.id), 1);

            return;
          }

          this.tableInvoke.setSort(this.getSortFromUrl());
          this.tableInvoke.setFilter(this.getFilterFromUrl());
        }
      });
    }
  }

  render() {
    const { cols, id, getData, defaultSort, className, headerActions, secondarySortField, invoke } = this.props;

    return (
      <XTable<T>
        className={className}
        cols={cols}
        id={id}
        getData={getData}
        defaultSort={defaultSort}
        filtersAlwaysEnabled
        showFiltersPanel
        secondarySortField={secondarySortField}
        defaultFilter={this.defaultFilter}
        invoke={invoke}
        onPageOptionsChange={this.handleTablePageOptionsChange}
        headerActions={headerActions}
      />
    );
  }

  @action.bound
  private handleTablePageOptionsChange(pageOptions: PageOptions) {
    if (this.props.setPageOptions) {
      this.props.setPageOptions(pageOptions);
    }

    const { sort, sortOrder: sortDir, filter } = pageOptions;
    const encodedSort = JSON.stringify([sort, sortDir]);
    const encodedFilter = JSON.stringify(filter);

    services.ngZone.run(() => {
      void services.router.navigate([location.pathname], {
        queryParams: {
          sort: encodedSort,
          filter: encodedFilter
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

  private getSortFromUrl(): SortParams<T> | undefined {
    try {
      const queryParamsSort = route.queryParams?.sort;
      const sort = queryParamsSort && (JSON.parse(queryParamsSort) as string[]);

      return sort && { field: sort[0] as keyof T, asc: sort[1] === SortOrder.ASC };
    } catch {
      services.logger.warn('Не удалось восстановить параметры сортировки из url');
    }
  }

  private getFilterFromUrl(): FilterQuery {
    try {
      const queryParamsFilter = route.queryParams?.filter;

      return queryParamsFilter && (JSON.parse(queryParamsFilter) as FilterQuery);
    } catch {
      services.logger.warn('Не удалось восстановить параметры фильтрации из url');
    }
  }

  @action.bound
  private setDefaultFilter() {
    if (this.props.defaultFilter) {
      this.defaultFilter = this.props.defaultFilter;
    }

    if (this.props.urlChangeEnabled) {
      this.defaultFilter = this.getFilterFromUrl();
    }
  }
}
