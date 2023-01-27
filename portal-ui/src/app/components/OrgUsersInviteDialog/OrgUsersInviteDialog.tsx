import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { FormDialog } from '../FormDialog/FormDialog';
import { PropertySchema, PropertyType } from '../../services/data/schema.models';
import { usersService } from '../../services/auth/users.service';

interface UserInvite {
  email?: string;
}

interface OrgUsersInviteDialogProps {
  open: boolean;
  onClose: () => void;
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
    try {
      await usersService.invite(value.email);

      Toast.success('Пользователь успешно добавлен в организацию');
      this.props.onClose();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (err.status === 409 || err.status === 404) {
        Toast.warn(err.response.data.message);

        return;
      }

      Toast.error(err);
      services.logger.error(error);
    }
  }
}
