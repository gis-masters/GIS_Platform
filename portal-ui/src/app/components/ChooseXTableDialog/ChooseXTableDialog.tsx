import React, { Component, ReactNode } from 'react';
import { isEqual } from 'lodash';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, computed, observable } from 'mobx';
import { Dialog, DialogActions, DialogContent } from '@mui/material';

import { XTableColumn } from '../XTable/XTable';
import { Button, ButtonProps } from '../Button/Button';
import { ChooseXTable } from '../ChooseXTable/ChooseXTable';
import { SortParams } from '../../services/util/sortObjects';
import { DialogActionsLeft } from '../DialogActionsLeft/DialogActionsLeft';
import { DialogActionsRight } from '../DialogActionsRight/DialogActionsRight';

import '!style-loader!css-loader!sass-loader!./ChooseXTableDialog.scss';
import '!style-loader!css-loader!sass-loader!./Table/ChooseXTableDialog-Table.scss';

const cnChooseXTableDialog = cn('ChooseXTableDialog');

interface ChooseXTableDialogProps<T> {
  title: string;
  actionButtonProps?: Omit<ButtonProps, 'ref'>;
  open: boolean;
  data: T[];
  selectedItems?: T[];
  disabledItems?: T[];
  cols: XTableColumn<T>[];
  defaultSort?: SortParams<T>;
  secondarySortField?: keyof T;
  getRowId: (rowData: T) => string | number;
  single?: boolean;
  additionalAction?: ReactNode;
  onClose(): void;
  onSelect(items: T[]): void;
}

@observer
export class ChooseXTableDialog<T> extends Component<ChooseXTableDialogProps<T>> {
  @observable private selected: T[] = [];

  render() {
    const {
      title,
      open,
      data,
      defaultSort,
      secondarySortField,
      actionButtonProps = {},
      single,
      additionalAction,
      cols,
      onClose,
      getRowId
    } = this.props;

    return (
      <Dialog PaperProps={{ className: cnChooseXTableDialog() }} open={open} onClose={onClose}>
        <DialogContent>
          <ChooseXTable<T>
            title={title}
            data={data}
            cols={cols}
            defaultSort={defaultSort}
            secondarySortField={secondarySortField}
            filterable
            single={single}
            onSelect={this.onSelected}
            getRowId={getRowId}
          />
        </DialogContent>
        <DialogActions>
          <DialogActionsLeft>{additionalAction}</DialogActionsLeft>
          <DialogActionsRight>
            {this.changed && (
              <Button disabled={!this.selected.length} onClick={this.select} color='primary' {...actionButtonProps}>
                {actionButtonProps.children || 'Выбрать'}
              </Button>
            )}
            <Button onClick={onClose}>{this.changed ? 'Отмена' : 'Закрыть'}</Button>
          </DialogActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get changed(): boolean {
    return !isEqual(this.selected, this.props.selectedItems);
  }

  @action.bound
  private onSelected(selected: T[]) {
    this.selected = selected;
  }

  @action.bound
  private select() {
    this.props.onSelect(this.selected);
  }
}
