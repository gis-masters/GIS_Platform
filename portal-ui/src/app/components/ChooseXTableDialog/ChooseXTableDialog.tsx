import React, { Component, ReactElement } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { SortParams } from '../../services/util/sortObjects';
import { XTable, XTableColumn } from '../XTable/XTable';
import { Button } from '../Button/Button';

import { ChooseXTableDialogCheck } from './Check/ChooseXTableDialog-Check';
import { ChooseXTableDialogTitle } from './Title/ChooseXTableDialog-Title';

import '!style-loader!css-loader!sass-loader!./ChooseXTableDialog.scss';
import '!style-loader!css-loader!sass-loader!./Table/ChooseXTableDialog-Table.scss';

const cnChooseXTableDialog = cn('ChooseXTableDialog');

interface ChooseXTableDialogProps<T> {
  title: string;
  actionLabel?: string;
  open: boolean;
  items: T[];
  selectedItems?: T[];
  disabledItems?: T[];
  cols: XTableColumn<T>[];
  defaultSort: SortParams<T>;
  secondarySortField: keyof T;
  onClose(): void;
  onSelect(items: T[]): void;
  getRowId: (rowData: T) => string | number;
  single?: boolean;
}

@observer
export class ChooseXTableDialog<T> extends Component<ChooseXTableDialogProps<T>> {
  @observable private selected: T[];
  @observable private viewed: T[];

  constructor(props: ChooseXTableDialogProps<T>) {
    super(props);

    this.setViewed([...props.items]);
    this.setSelected([...(props.selectedItems || [])]);
  }

  componentDidUpdate(prevProps: ChooseXTableDialogProps<T>) {
    const { open, items, selectedItems = [] } = this.props;

    if (this.isItemsCanBeViewed(prevProps)) {
      this.setViewed([...items]);
    }

    if (open && !prevProps.open) {
      this.setSelected([...selectedItems]);
    }
  }

  render() {
    const { title, open, items, defaultSort, secondarySortField, onClose, actionLabel, single } = this.props;

    return (
      <Dialog PaperProps={{ className: cnChooseXTableDialog() }} open={open} onClose={onClose}>
        <DialogContent>
          <XTable<T>
            className={cnChooseXTableDialog('Table')}
            title={
              <ChooseXTableDialogTitle title={title} items={items} selectedItems={this.selected} single={single} />
            }
            data={items}
            cols={this.cols}
            defaultSort={defaultSort}
            secondarySortField={secondarySortField}
            onFilter={this.setViewed}
            filterable
          />
        </DialogContent>
        <DialogActions>
          {this.changed && (
            <Button disabled={!this.selected.length} onClick={this.select} color='primary'>
              {actionLabel || 'Выбрать'}
            </Button>
          )}
          <Button onClick={onClose}>{this.changed ? 'Отмена' : 'Закрыть'}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  get cols(): XTableColumn<T>[] {
    return [
      {
        title: !this.props.single ? (
          <Checkbox
            indeterminate={this.selected.length > 0 && !this.allSelected}
            checked={this.allSelected}
            onChange={this.selectAll}
          />
        ) : null,
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
  private select() {
    this.props.onSelect(this.selected);
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: T }): ReactElement {
    return (
      <ChooseXTableDialogCheck
        single={this.props.single}
        item={rowData}
        selectedItems={this.selected}
        getRowId={this.props.getRowId}
      />
    );
  }

  @boundMethod
  private selectAll() {
    this.setSelected(this.allSelected ? [] : [...this.viewed]);
  }

  private isItemsCanBeViewed(prevProps: ChooseXTableDialogProps<T>) {
    const { open, items, getRowId } = this.props;

    return (
      (open && prevProps.items.length !== items.length) ||
      prevProps.items.every((item, i) => getRowId(item) === getRowId(items[i]))
    );
  }
}
