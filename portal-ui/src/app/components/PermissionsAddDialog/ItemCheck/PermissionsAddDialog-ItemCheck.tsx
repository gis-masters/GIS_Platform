import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Checkbox } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { Dataset, DataTable } from '../../../services/data.service';
import { CrgProject } from '../../../services/crg/projects.models';

const cnPermissionsAddDialogItemCheck = cn('PermissionsAddDialog', 'ItemCheck');

interface PermissionsAddDialogItemCheckProps {
  item: CrgProject | DataTable | Dataset;
  checked: boolean;
  disabled: boolean;
  onChange: (item: CrgProject | DataTable | Dataset, checked: boolean) => void;
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
        onChange={this.changeHandler}
      />
    );
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { item, onChange } = this.props;
    onChange(item, checked);
  }
}
