import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Checkbox, Radio } from '@mui/material';

const cnChooseXTableCheck = cn('ChooseXTable', 'Check');

interface ChooseXTableCheckProps<T> {
  item: T;
  selectedItems: T[];
  getRowId: (rowData: T) => string | number;
  single: boolean;
  onSelect(items: T[]): void;
}

@observer
export class ChooseXTableCheck<T> extends Component<ChooseXTableCheckProps<T>> {
  constructor(props: ChooseXTableCheckProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const Check = this.props.single ? Radio : Checkbox;

    return <Check className={cnChooseXTableCheck()} checked={this.selected} onChange={this.changeHandler} />;
  }

  @computed
  private get selected(): boolean {
    const { item, selectedItems, getRowId } = this.props;

    return selectedItems.some(selectedItem => getRowId(selectedItem) === getRowId(item));
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
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
