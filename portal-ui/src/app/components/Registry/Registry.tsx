import React, { Component, ReactNode } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PageOptions, SortOrder } from '../../services/models';
import { services } from '../../services/services';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { SortParams } from '../../services/util/sortObjects';
import { route } from '../../stores/Route.store';
import { XTable, XTableProps } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';

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
        defaultSort={defaultSort}
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

      if (sort) {
        return { field: sort[0] as keyof T, asc: sort[1] === SortOrder.ASC };
      }
    } catch {
      services.logger.warn('Не удалось восстановить параметры сортировки из url');
    }
  }

  private getFilterFromUrl(): FilterQuery | undefined {
    try {
      const queryParamsFilter = route.queryParams?.filter;
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
}
