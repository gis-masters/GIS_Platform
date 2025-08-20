import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';

import { usersService } from '../../services/auth/users/users.service';
import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';
import { Toast } from '../Toast/Toast';

interface UserInvite {
  email: string;
}

interface OrgUsersInviteDialogProps {
  open: boolean;
  onClose(): void;
}

@observer
export class OrgUsersInviteDialog extends Component<OrgUsersInviteDialogProps> {
  constructor(props: OrgUsersInviteDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <FormDialog<UserInvite>
        title='Приглашение пользователя в организацию'
        open={open}
        schema={{ properties: this.userProperties }}
        value={{ email: '' }}
        actionFunction={this.invite}
        actionButtonProps={{ children: 'Пригласить' }}
        onClose={onClose}
      />
    );
  }

  @computed
  private get userProperties(): PropertySchema[] {
    return [
      {
        name: 'email',
        title: 'E-mail',
        required: true,
        wellKnownRegex: 'email',
        propertyType: PropertyType.STRING
      }
    ];
  }

  @boundMethod
  private async invite(value: UserInvite) {
    await usersService.invite(value.email);

    Toast.success('Пользователь успешно добавлен в организацию');
  }
}
