import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AddCircle, AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MinimizedCrgUser } from '../../../services/auth/users/users.models';
import { usersService } from '../../../services/auth/users/users.service';
import { PageOptions } from '../../../services/models';
import { isFilterQuery } from '../../../services/util/filters/filters.models';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { replaceObjectKeys } from '../../../services/util/object';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Button } from '../../Button/Button';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { LookupAdd } from '../../Lookup/Add/Lookup-Add';
import { XTableColumn } from '../../XTable/XTable.models';

const cnUsersAdd = cn('Users', 'Add');
const cnUsersAddDialog = cn('Users', 'AddDialog');

interface UsersAddProps {
  filled: boolean;
  multiple: boolean;
  onlySubordinates: boolean;
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
          {filled && multiple ? 'Добавить пользователя' : 'Выбрать пользователя'}
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

  @boundMethod
  private async getUsers(pageOptions: PageOptions): Promise<[MinimizedCrgUser[], number]> {
    if (this.props.onlySubordinates) {
      pageOptions.filter = { ...pageOptions.filter, boss_id: currentUser.id };
    }

    if (pageOptions.filter && Object.keys(pageOptions.filter).length) {
      const newFilter = replaceObjectKeys(pageOptions.filter, {
        surname: 'sur_name',
        middleName: 'middle_name'
      });

      if (isFilterQuery(newFilter)) {
        pageOptions.filter = newFilter;
      }
    }

    const [users, totalPages] = await usersService.getUsers(pageOptions);
    const usersArr: MinimizedCrgUser[] = users
      .map(user => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          middleName: user.middleName || ''
        };
      })
      .filter(notFalsyFilter);

    if (this.props.onlySubordinates) {
      usersArr.unshift(currentUser);
    }

    return [usersArr, totalPages];
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
