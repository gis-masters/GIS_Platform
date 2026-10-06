import React, { Component, type ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { type PageOptions } from '../../services/models';
import { type SortParams } from '../../services/util/sortObjects';
import { type ButtonProps } from '../Button/Button';
import { XTable } from '../XTable/XTable';
import { type XTableColumn } from '../XTable/XTable.models';
import { defaultRowIdGetter } from '../XTable/XTable.utils';
import { ChooseXTableCheck } from './Check/ChooseXTable-Check';
import { ChooseXTableTitle } from './Title/ChooseXTable-Title';

const cnChooseXTable = cn('ChooseXTable');

export type ChooseXTableSelectionStatus = {
  empty: boolean;
  changed: boolean;
};

interface ChooseXTableBaseProps<T> extends IClassNameProps {
  title?: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  data?: T[];
  selectedItems?: T[];
  disabledTester?(item: T): boolean | string;
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  single?: boolean;
  withoutSelectAll?: boolean;
  loading?: boolean;
  showFiltersPanel?: boolean;
  filterable?: boolean;
  filtersAlwaysEnabled?: boolean;
  getRowId?(rowData: T): string | number;
  onSelect(items: T[]): void;
  onSelectionStatusChange?(status: ChooseXTableSelectionStatus): void;
}

interface ChooseXTableSyncProps<T> extends ChooseXTableBaseProps<T> {
  data?: T[];
}

interface ChooseXTableAsyncProps<T> extends ChooseXTableBaseProps<T> {
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
}

export type ChooseXTableProps<T> = ChooseXTableSyncProps<T> | ChooseXTableAsyncProps<T>;

@observer
export class ChooseXTable<T> extends Component<ChooseXTableProps<T>> {
  @observable private selected: T[] = [];
  @observable private viewed: T[] = [];
  private mounted = false;

  constructor(props: ChooseXTableProps<T>) {
    super(props);
    makeObservable(this);

    this.setViewed([...(props.data || [])]);
    this.setSelected([...(props.selectedItems || [])]);
  }

  componentDidMount() {
    this.mounted = true;
    this.emitSelectionStatusChange();
  }

  componentDidUpdate(prevProps: ChooseXTableProps<T>) {
    const { data } = this.props;

    if (this.isItemsCanBeViewed(prevProps) && data) {
      this.setViewed([...data]);
    }

    if (
      prevProps.disabledTester !== this.props.disabledTester ||
      prevProps.selectedItems !== this.props.selectedItems ||
      prevProps.data !== data ||
      this.getSelectedIdsSignature(this.selected) !== this.getSelectedIdsSignature(this.selectedAvailable)
    ) {
      this.setSelected(this.selected);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      title = '',
      data,
      defaultSort,
      loading,
      secondarySortField,
      single = false,
      filterable,
      className,
      filtersAlwaysEnabled
    } = this.props;
    const { getData, getRowId } = this.props as ChooseXTableAsyncProps<T>;

    return (
      <XTable<T>
        className={cnChooseXTable(null, [className])}
        title={
          <ChooseXTableTitle title={title} items={data || []} selectedItems={this.selectedAvailable} single={single} />
        }
        data={data}
        cols={this.cols}
        loading={loading}
        defaultSort={defaultSort}
        secondarySortField={secondarySortField}
        onFilter={this.setViewed}
        filtersAlwaysEnabled={filtersAlwaysEnabled}
        filterable={filterable}
        getRowId={getRowId}
        getData={getData}
      />
    );
  }

  getSelected(): T[] {
    return this.selectedAvailable;
  }

  @computed
  get cols(): XTableColumn<T>[] {
    return [
      {
        title: this.props.withoutSelectAll
          ? null
          : !this.props.single && (
              <Checkbox
                indeterminate={this.selectedAvailable.length > 0 && !this.allSelected}
                checked={this.allSelected}
                onChange={this.selectAll}
              />
            ),
        cellProps: { padding: 'checkbox' },
        CellContent: this.renderCheckbox
      },
      ...this.props.cols
    ];
  }

  @computed
  private get selectedAvailable(): T[] {
    return this.selected.map(item => this.getCurrentItem(item)).filter(item => !this.isItemDisabled(item));
  }

  @computed
  private get changed(): boolean {
    return !isEqual(this.selectedAvailable, this.props.selectedItems || []);
  }

  @computed
  private get allSelected(): boolean {
    const { getRowId = defaultRowIdGetter } = this.props;
    const availableViewed = this.getAvailable(this.viewed);
    const selectedIds = new Set(this.selectedAvailable.map(item => getRowId(item)));

    return availableViewed.length > 0 && availableViewed.every(item => selectedIds.has(getRowId(item)));
  }

  @action
  private setSelected(items: T[]): void {
    this.selected = items.map(item => this.getCurrentItem(item)).filter(item => !this.isItemDisabled(item));

    if (this.mounted) {
      this.emitSelectionStatusChange();
    }
  }

  @action.bound
  private setViewed(items: T[]): void {
    this.viewed = items;
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: T }): ReactElement {
    const { single = false, getRowId = defaultRowIdGetter } = this.props;

    return (
      <ChooseXTableCheck
        single={single}
        item={rowData}
        disabled={this.isItemDisabled(rowData)}
        disabledMessage={this.getDisabledMessage(rowData)}
        selectedItems={this.selected}
        getRowId={getRowId}
        onSelect={this.handleItemsSelect}
      />
    );
  }

  @boundMethod
  private handleItemsSelect(items: T[]): void {
    this.setSelected(items);
    this.props.onSelect(this.selected);
  }

  @boundMethod
  private selectAll() {
    const { getRowId = defaultRowIdGetter } = this.props;
    const availableViewed = this.getAvailable(this.viewed);
    const availableViewedIds = new Set(availableViewed.map(item => getRowId(item)));

    if (this.allSelected) {
      this.setSelected(this.selectedAvailable.filter(item => !availableViewedIds.has(getRowId(item))));
    } else {
      const kept = this.selectedAvailable.filter(item => !availableViewedIds.has(getRowId(item)));
      this.setSelected([...kept, ...availableViewed]);
    }

    this.props.onSelect(this.selected);
  }

  private emitSelectionStatusChange(): void {
    this.props.onSelectionStatusChange?.({
      empty: this.selectedAvailable.length === 0,
      changed: this.changed
    });
  }

  private getSelectedIdsSignature(items: T[]): string {
    const { getRowId = defaultRowIdGetter } = this.props;

    return items.map(item => String(getRowId(item))).join(',');
  }

  private getCurrentItem(item: T): T {
    const { data, getRowId = defaultRowIdGetter } = this.props;
    if (!data?.length) {
      return item;
    }

    return data.find(row => getRowId(row) === getRowId(item)) ?? item;
  }

  private getDisabledResult(item: T): boolean | string | undefined {
    return this.props.disabledTester?.(this.getCurrentItem(item));
  }

  private isItemDisabled(item: T): boolean {
    const result = this.getDisabledResult(item);

    return result === true || (typeof result === 'string' && result.length > 0);
  }

  private getDisabledMessage(item: T): string {
    const result = this.getDisabledResult(item);

    return typeof result === 'string' ? result : '';
  }

  private getAvailable(items: T[]): T[] {
    return items.filter(item => !this.isItemDisabled(item));
  }

  private isItemsCanBeViewed(prevProps: ChooseXTableProps<T>) {
    const { data, getRowId = defaultRowIdGetter } = this.props;
    if (!data?.length || !prevProps.data?.length) {
      return;
    }

    return (
      prevProps.data.length !== data.length || prevProps.data.every((item, i) => getRowId(item) === getRowId(data[i]))
    );
  }
}
