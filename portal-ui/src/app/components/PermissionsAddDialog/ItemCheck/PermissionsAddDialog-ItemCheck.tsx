import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Dataset, VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { CrgProject } from '../../../services/gis/projects/projects.models';

const cnPermissionsAddDialogItemCheck = cn('PermissionsAddDialog', 'ItemCheck');

interface PermissionsAddDialogItemCheckProps {
  item: CrgProject | VectorTable | Dataset;
  checked: boolean;
  disabled: boolean;
  onChange(item: CrgProject | VectorTable | Dataset, checked: boolean): void;
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
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { item, onChange } = this.props;
    onChange(item, checked);
  }
}
