import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Checkbox } from '@material-ui/core';

const cnChooseXTableDialogCheck = cn('ChooseXTableDialog', 'Check');

interface ChooseXTableDialogCheckProps<T> {
  item: T;
  selectedItems: T[];
  getRowId: (rowData: T) => string | number;
}

@observer
export class ChooseXTableDialogCheck<T> extends Component<ChooseXTableDialogCheckProps<T>> {
  render() {
    return <Checkbox className={cnChooseXTableDialogCheck()} checked={this.selected} onChange={this.changeHandler} />;
  }

  @computed
  private get selected(): boolean {
    const { item, selectedItems, getRowId } = this.props;

    return selectedItems.some(selectedItem => getRowId(selectedItem) === getRowId(item));
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { item, selectedItems, getRowId } = this.props;

    if (checked) {
      selectedItems.push(item);
    } else {
      selectedItems.splice(
        selectedItems.findIndex(sItem => getRowId(item) === getRowId(sItem)),
        1
      );
    }
  }
}
