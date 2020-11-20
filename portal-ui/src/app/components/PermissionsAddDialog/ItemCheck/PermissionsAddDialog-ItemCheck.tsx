import React, { Component } from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Checkbox } from '@material-ui/core';

import { PermissionsListItem } from '../../../services/crg/allPermissions.service';

const cnPermissionsAddDialogItemCheck = cn('PermissionsAddDialog', 'ItemCheck');

interface PermissionsAddDialogItemCheckProps {
  item: PermissionsListItem;
  selectedList: PermissionsListItem[];
  currentList: PermissionsListItem[];
}

@observer
export class PermissionsAddDialogItemCheck extends Component<PermissionsAddDialogItemCheckProps> {
  constructor(props: PermissionsAddDialogItemCheckProps) {
    super(props);
  }

  render() {
    const { item } = this.props;

    return (
      <Checkbox
        className={cnPermissionsAddDialogItemCheck()}
        checked={this.selected}
        onChange={this.changeHandler}
        disabled={this.existing || item.broken}
      />
    );
  }

  @computed
  private get selected(): boolean {
    const { item, selectedList } = this.props;

    return selectedList.includes(item) || this.existing;
  }

  @computed
  private get existing(): boolean {
    const { item, currentList: existingList } = this.props;

    return existingList.some(
      ({ project, layer }) => item.project.id === project.id && (item.layer && item.layer.id) === (layer && layer.id)
    );
  }

  @action.bound
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { item, selectedList } = this.props;

    if (checked) {
      selectedList.push(item);
    } else {
      selectedList.splice(selectedList.indexOf(item), 1);
    }
  }
}
