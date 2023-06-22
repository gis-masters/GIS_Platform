import React, { Component, ReactNode } from 'react';
import { isEqual } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, computed, observable, makeObservable } from 'mobx';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { XTableColumn } from '../XTable/XTable.models';
import { PageOptions } from '../../services/models';
import { Button, ButtonProps } from '../Button/Button';
import { ChooseXTable } from '../ChooseXTable/ChooseXTable';
import { SortParams } from '../../services/util/sortObjects';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';

import '!style-loader!css-loader!sass-loader!./Content/ChooseXTableDialog-Content.scss';
import '!style-loader!css-loader!sass-loader!./Table/ChooseXTableDialog-Table.scss';

const cnChooseXTableDialog = cn('ChooseXTableDialog');

export interface ChooseXTableDialogBaseProps<T> extends IClassNameProps {
  title: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  open: boolean;
  data: T[];
  selectedItems?: T[];
  disabledItems?: T[];
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  getRowId?: (rowData: T) => string | number;
  single?: boolean;
  additionalAction?: ReactNode;
  onClose(): void;
  onSelect(items: T[]): void;
}

interface ChooseXTableDialogSyncProps<T> extends ChooseXTableDialogBaseProps<T> {
  data: T[];
}

interface ChooseXTableDialogAsyncProps<T> extends ChooseXTableDialogBaseProps<T> {
  getData(pageOptions: PageOptions): Promise<[T[], number]>;
}

export type ChooseXTableDialogProps<T> = ChooseXTableDialogAsyncProps<T> | ChooseXTableDialogSyncProps<T>;

@observer
export default class ChooseXTableDialog<T> extends Component<ChooseXTableDialogProps<T>> {
  @observable private selected: T[] = [];

  constructor(props: ChooseXTableDialogProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const {
      className,
      title,
      open,
      data,
      defaultSort,
      secondarySortField,
      actionButtonProps = {},
      single,
      additionalAction,
      selectedItems,
      cols,
      getRowId
    } = this.props as ChooseXTableDialogSyncProps<T>;
    const { getData } = this.props as ChooseXTableDialogAsyncProps<T>;

    return (
      <Dialog
        PaperProps={{ className: cnChooseXTableDialog(null, [className]) }}
        open={open}
        onClose={this.close}
        maxWidth='xl'
      >
        <DialogContent className={cnChooseXTableDialog('Content')}>
          <ChooseXTable<T>
            className={cnChooseXTableDialog('Table')}
            title={title}
            data={data}
            cols={cols}
            defaultSort={defaultSort}
            secondarySortField={secondarySortField}
            filterable
            filtersAlwaysEnabled
            single={single}
            selectedItems={selectedItems}
            onSelect={this.select}
            getRowId={getRowId}
            getData={getData}
          />
        </DialogContent>
        <DialogActions>
          <ActionsLeft>{additionalAction}</ActionsLeft>
          <ActionsRight>
            {this.changed && (
              <Button
                disabled={!this.selected.length}
                onClick={this.submit}
                color='primary'
                {...actionButtonProps}
                className={cnChooseXTableDialog('Submit', [actionButtonProps.className])}
              >
                {actionButtonProps.children || 'Выбрать'}
              </Button>
            )}
            <Button onClick={this.close}>{this.changed ? 'Отмена' : 'Закрыть'}</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private close() {
    this.props.onClose();
    this.select([]);
  }

  @computed
  private get changed(): boolean {
    return !isEqual(this.selected, this.props.selectedItems);
  }

  @action.bound
  private select(selected: T[]) {
    this.selected = selected;
  }

  @action.bound
  private submit() {
    this.props.onSelect(this.selected);
  }
}
