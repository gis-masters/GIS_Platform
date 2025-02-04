import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MinimizedCrgUser } from '../../services/auth/users/users.models';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { LookupList } from '../Lookup/List/Lookup-List';
import { Lookup } from '../Lookup/Lookup';
import { Toast } from '../Toast/Toast';
import { UsersAdd } from './Add/Users-Add';
import { UsersItem } from './Item/Users-Item';

const cnUsers = cn('Users');

export interface UsersProps {
  value: MinimizedCrgUser[];
  multiple?: boolean;
  onlySubordinates?: boolean;
  editable?: boolean;
  onChange?(value: MinimizedCrgUser[]): void;
}

export default class Users extends Component<UsersProps> {
  render() {
    const { value, multiple = false, editable = false, onlySubordinates = false } = this.props;
    const numerous = value.length > 1;
    const clearedValue = value.filter(notFalsyFilter);

    return (
      <Lookup className={cnUsers()}>
        {!!clearedValue.length && (
          <LookupList multiple={multiple} numerous={numerous} editable={editable}>
            {clearedValue.map((item, i) => {
              return (
                <UsersItem
                  item={item}
                  onDelete={this.handleDelete}
                  key={`${item.id}_${i}`}
                  editable={editable}
                  numerous={numerous}
                  multiple={multiple}
                />
              );
            })}
          </LookupList>
        )}
        {editable && (
          <UsersAdd
            onlySubordinates={onlySubordinates}
            multiple={multiple}
            filled={Boolean(value.length)}
            onChange={this.handleAdd}
            value={value}
          />
        )}
      </Lookup>
    );
  }

  @boundMethod
  private handleDelete(deletingItem: MinimizedCrgUser) {
    const { onChange, value } = this.props;

    if (onChange) {
      onChange(value.filter(({ id }) => !(id === deletingItem.id)));
    } else {
      Toast.error('Ошибка удаления пользователя');
    }
  }

  @boundMethod
  private handleAdd(selectedUsers: MinimizedCrgUser[]) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(selectedUsers);
    } else {
      Toast.error('Ошибка добавления пользователя');
    }
  }
}
