import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AddCircle, AddCircleOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import { PageOptions } from '../../../services/models';
import { LookupAdd } from '../../Lookup/Add/Lookup-Add';
import { XTableColumn } from '../../XTable/XTable.models';
import { MinimizedCrgUser } from '../../../services/auth/users/users.models';
import { usersService } from '../../../services/auth/users/users.service';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';

const cnUsersAdd = cn('Users', 'Add');
const cnUsersAddDialog = cn('Users', 'AddDialog');

interface UsersAddProps {
  filled: boolean;
  multiple: boolean;
  value: MinimizedCrgUser[];
  onChange(selectedItems: MinimizedCrgUser[]): void;
}

@observer
export class UsersAdd extends Component<UsersAddProps> {
  @observable private dialogOpen = false;

  constructor(props: UsersAddProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { filled, multiple, value } = this.props;

    return (
      <LookupAdd filled={filled}>
        <Button
          className={cnUsersAdd()}
          variant='text'
          startIcon={this.dialogOpen ? <AddCircle /> : <AddCircleOutline />}
          color='primary'
          onClick={this.openDialog}
        >
          {filled ? 'Добавить пользователя' : 'Выбрать пользователя'}
        </Button>

        <ChooseXTableDialog<MinimizedCrgUser>
          getData={this.getUsers}
          className={cnUsersAddDialog()}
          title='Выберите пользователя'
          data={[]}
          selectedItems={value}
          cols={this.getUserColumns()}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.onSelect}
          single={!multiple}
        />
      </LookupAdd>
    );
  }

  private async getUsers(pageOptions: PageOptions): Promise<[MinimizedCrgUser[], number]> {
    const users = await usersService.getUsers(pageOptions);

    return [
      users[0].map(user => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          middleName: user.middleName || ''
        };
      }),
      users[1]
    ];
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private onSelect(users: MinimizedCrgUser[]) {
    this.props.onChange(users);
    this.closeDialog();
  }

  private getUserColumns(): XTableColumn<MinimizedCrgUser>[] {
    return [
      { title: 'Фамилия', field: 'surname', filterable: true, sortable: true },
      { title: 'Имя', field: 'name', filterable: true, sortable: true },
      { title: 'Отчество', field: 'middleName', filterable: true, sortable: true },
      { title: 'e-mail', field: 'email', filterable: true, sortable: true, getIdBadge: ({ id }) => id }
    ];
  }
}
