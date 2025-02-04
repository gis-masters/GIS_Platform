import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { CrgUser } from '../../../services/auth/users/users.models';

const cnPermissionsEditDialogCheckPrincipal = cn('PermissionsEditDialog', 'CheckPrincipal');

interface PermissionsEditDialogCheckPrincipalProps {
  principal: CrgGroup | CrgUser;
  selectedPrincipals: (CrgGroup | CrgUser)[];
  availablePrincipals: (CrgGroup | CrgUser)[];
}

@observer
export class PermissionsEditDialogCheckPrincipal extends Component<PermissionsEditDialogCheckPrincipalProps> {
  constructor(props: PermissionsEditDialogCheckPrincipalProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Checkbox
        className={cnPermissionsEditDialogCheckPrincipal()}
        checked={this.selected || this.alreadyAdded}
        onChange={this.handleChange}
        disabled={this.alreadyAdded}
      />
    );
  }

  @computed
  private get selected(): boolean {
    const { principal, selectedPrincipals } = this.props;

    return selectedPrincipals.some(({ id }) => principal.id === id);
  }

  @computed
  private get alreadyAdded(): boolean {
    const { principal, availablePrincipals } = this.props;

    return !availablePrincipals.some(({ id }) => principal.id === id);
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    const { principal, selectedPrincipals } = this.props;

    if (checked) {
      selectedPrincipals.push(principal);
    } else {
      selectedPrincipals.splice(selectedPrincipals.indexOf(principal), 1);
    }
  }
}
