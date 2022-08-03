import React, { Component, ReactElement } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { SortParams } from '../../services/util/sortObjects';
import { XTable, XTableColumn } from '../XTable/XTable';
import { ButtonProps } from '../Button/Button';

import { ChooseXTableCheck } from './Check/ChooseXTable-Check';
import { ChooseXTableTitle } from './Title/ChooseXTable-Title';

const cnChooseXTable = cn('ChooseXTable');

interface ChooseXTableProps<T> extends IClassNameProps {
  title?: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  data: T[];
  selectedItems?: T[];
  disabledItems?: T[];
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  getRowId: (rowData: T) => string | number;
  single?: boolean;
  filterable?: boolean;
  onSelect(items: T[]): void;
}

@observer
export class ChooseXTable<T> extends Component<ChooseXTableProps<T>> {
  @observable private selected: T[];
  @observable private viewed: T[];

  constructor(props: ChooseXTableProps<T>) {
    super(props);
    makeObservable(this);

    this.setViewed([...props.data]);
    this.setSelected([...(props.selectedItems || [])]);
  }

  componentDidUpdate(prevProps: ChooseXTableProps<T>) {
    const { data } = this.props;

    if (this.isItemsCanBeViewed(prevProps)) {
      this.setViewed([...data]);
    }
  }

  render() {
    const { title, data, defaultSort, secondarySortField, single, filterable, className } = this.props;

    return (
      <XTable<T>
        className={cnChooseXTable('Table', [className])}
        title={<ChooseXTableTitle title={title} items={data} selectedItems={this.selected} single={single} />}
        data={data}
        cols={this.cols}
        defaultSort={defaultSort}
        secondarySortField={secondarySortField}
        onFilter={this.setViewed}
        filterable={filterable}
      />
    );
  }

  @computed
  get cols(): XTableColumn<T>[] {
    return [
      {
        title: !this.props.single && (
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
    const { single, getRowId, onSelect } = this.props;

    return (
      <ChooseXTableCheck
        single={single}
        item={rowData}
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
    const { data, getRowId } = this.props;
    if (!data?.length || !prevProps.data?.length) {
      return;
    }

    return (
      prevProps.data.length !== data.length || prevProps.data.every((item, i) => getRowId(item) === getRowId(data[i]))
    );
  }
}
