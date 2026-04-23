import React, { type ChangeEvent, Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type Dataset, type VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { type CrgProject } from '../../../services/gis/projects/projects.models';

const cnPermissionsAddDialogItemCheck = cn('PermissionsAddDialog', 'ItemCheck');

type PermissionsAddDialogCheckItem = CrgProject | VectorTable | Dataset;

interface PermissionsAddDialogItemCheckProps {
  item: PermissionsAddDialogCheckItem;
  checked: boolean;
  disabled: boolean;
  onSelectItem(item: PermissionsAddDialogCheckItem): void;
  onDeselectItem(item: PermissionsAddDialogCheckItem): void;
}

@observer
export class PermissionsAddDialogItemCheck extends Component<PermissionsAddDialogItemCheckProps> {
  render() {
    const { checked, disabled } = this.props;

    return (
      <Checkbox
        className={cnPermissionsAddDialogItemCheck()}
        checked={checked}
        disabled={disabled}
        onChange={this.handleChange}
      />
    );
  }

  @boundMethod
  private handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { item, onSelectItem, onDeselectItem } = this.props;
    if (e.target.checked) {
      onSelectItem(item);
    } else {
      onDeselectItem(item);
    }
  }
}
