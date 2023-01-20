import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Toast } from '../Toast/Toast';
import { getPatch } from '../../services/util/patch';
import { FormDialog } from '../FormDialog/FormDialog';
import { PropertySchema, PropertySchemaString, PropertyType } from '../../services/data/schema.models';
import { usersService, NewUserData, CrgUser } from '../../services/auth/users.service';

import '!style-loader!css-loader!sass-loader!./OrgUsersCreateEditDialog.scss';

interface OrgUsersCreateEditDialogProps {
  open: boolean;
  onClose: () => void;
  create?: boolean;
  user?: CrgUser;
}

@observer
export class OrgUsersCreateEditDialog extends Component<OrgUsersCreateEditDialogProps> {
  constructor(props: OrgUsersCreateEditDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose, user } = this.props;

    return (
      <FormDialog
        open={open}
        schema={{ properties: this.userProperties }}
        value={user}
        actionFunction={this.save}
        actionButtonProps={{ children: !user ? 'Создать' : 'Обновить' }}
        onClose={onClose}
      />
    );
  }

  @computed
  private get userProperties(): PropertySchema[] {
    const userInfo: PropertySchema[] = [
      {
        name: 'email',
        title: 'E-mail:',
        required: true,
        wellKnownRegex: 'email',
        propertyType: PropertyType.STRING
      },
      {
        name: 'surname',
        title: 'Фамилия',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'name',
        title: 'Имя',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'middleName',
        title: 'Отчество',
        propertyType: PropertyType.STRING
      },
      {
        name: 'job',
        title: 'Должность',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'department',
        title: 'Организация',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'phone',
        title: 'Контактный номер телефона',
        required: true,
        display: 'phone',
        propertyType: PropertyType.STRING
      },
      {
        name: 'enabled',
        title: 'Активен',
        defaultValue: true,
        propertyType: PropertyType.BOOL
      }
    ];

    if (this.props.create) {
      const password: PropertySchemaString = {
        name: 'password',
        title: 'Пароль',
        display: 'password',
        required: true,
        propertyType: PropertyType.STRING
      };

      userInfo.push(password);
    }

    return userInfo;
  }

  @boundMethod
  private async save(value: NewUserData) {
    const { user, create } = this.props;
    try {
      await (create ? usersService.create(value) : usersService.edit(getPatch(value, user), user.id));
    } catch (error) {
      Toast.error(error as AxiosError);

      return;
    }
    this.props.onClose();
  }
}
