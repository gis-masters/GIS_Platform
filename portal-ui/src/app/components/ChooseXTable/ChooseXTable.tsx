import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { PageOptions } from '../../services/models';
import { SortParams } from '../../services/util/sortObjects';
import { ButtonProps } from '../Button/Button';
import { XTable } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { defaultRowIdGetter } from '../XTable/XTable.utils';
import { ChooseXTableCheck } from './Check/ChooseXTable-Check';
import { ChooseXTableTitle } from './Title/ChooseXTable-Title';

const cnChooseXTable = cn('ChooseXTable');

interface ChooseXTableBaseProps<T> extends IClassNameProps {
  title?: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  data?: T[];
  selectedItems?: T[];
  disabledItems?: T[];
  disabledItemsMessage?: string;
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

  constructor(props: ChooseXTableProps<T>) {
    super(props);
    makeObservable(this);

    this.setViewed([...(props.data || [])]);
    this.setSelected([...(props.selectedItems || [])]);
  }

  componentDidUpdate(prevProps: ChooseXTableProps<T>) {
    const { data } = this.props;

    if (this.isItemsCanBeViewed(prevProps) && data) {
      this.setViewed([...data]);
    }
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
        title={<ChooseXTableTitle title={title} items={data || []} selectedItems={this.selected} single={single} />}
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

  @computed
  get cols(): XTableColumn<T>[] {
    return [
      {
        title: this.props.withoutSelectAll
          ? null
          : !this.props.single && (
              <Checkbox
                indeterminate={this.selected.length > 0 && !this.allSelected}
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
  private get changed(): boolean {
    return !isEqual(this.selected, this.props.selectedItems);
  }

  @computed
  private get allSelected(): boolean {
    const { disabledItems = [] } = this.props;

    return this.viewed.length > 0 && this.selected.length === this.viewed.length - disabledItems.length;
  }

  @action
  private setSelected(items: T[]): void {
    this.selected = items;
  }

  @action.bound
  private setViewed(items: T[]): void {
    this.viewed = items;
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: T }): ReactElement {
    const { single = false, disabledItems, disabledItemsMessage, getRowId = defaultRowIdGetter, onSelect } = this.props;

    return (
      <ChooseXTableCheck
        single={single}
        item={rowData}
        disabled={disabledItems?.includes(rowData)}
        disabledItemsMessage={disabledItemsMessage}
        selectedItems={this.selected}
        getRowId={getRowId}
        onSelect={onSelect}
      />
    );
  }

  @boundMethod
  private selectAll() {
    this.setSelected(this.allSelected ? [] : [...this.viewed]);

    this.props.onSelect(this.selected);
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
