import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Radio, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

const cnChooseXTableCheck = cn('ChooseXTable', 'Check');

interface ChooseXTableCheckProps<T> {
  item: T;
  selectedItems: T[];
  single: boolean;
  disabled?: boolean;
  disabledItemsMessage?: string;
  getRowId(rowData: T): string | number;
  onSelect(items: T[]): void;
}

@observer
export class ChooseXTableCheck<T> extends Component<ChooseXTableCheckProps<T>> {
  constructor(props: ChooseXTableCheckProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { single, disabledItemsMessage, disabled = false } = this.props;
    const Check = single ? Radio : Checkbox;

    return (
      <Tooltip title={disabled && disabledItemsMessage} placement='top'>
        <span>
          <Check
            disabled={disabled}
            className={cnChooseXTableCheck()}
            checked={this.selected}
            onChange={this.handleChange}
          />
        </span>
      </Tooltip>
    );
  }

  @computed
  private get selected(): boolean {
    const { item, selectedItems, getRowId } = this.props;

    return selectedItems.some(selectedItem => getRowId(selectedItem) === getRowId(item));
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { item, selectedItems, getRowId, single, onSelect } = this.props;
    if (single && checked) {
      selectedItems.splice(0, selectedItems.length, item);
    } else if (checked) {
      selectedItems.push(item);
    } else {
      selectedItems.splice(
        selectedItems.findIndex(sItem => getRowId(item) === getRowId(sItem)),
        1
      );
    }

    onSelect(selectedItems);
  }
}
