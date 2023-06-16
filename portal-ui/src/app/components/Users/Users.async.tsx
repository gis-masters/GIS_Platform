import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { MinimizedCrgUser } from '../../services/auth/users/users.models';

import { Lookup } from '../Lookup/Lookup';
import { UsersAdd } from './Add/Users-Add';
import { UsersItem } from './Item/Users-Item';
import { LookupList } from '../Lookup/List/Lookup-List';

const cnUsers = cn('Users');

export interface UsersProps {
  value: MinimizedCrgUser[];
  multiple?: boolean;
  editable?: boolean;
  onChange?(value: MinimizedCrgUser[]): void;
}

export default class Users extends Component<UsersProps> {
  render() {
    const { value, multiple, editable } = this.props;
    const numerous = value.length > 1;

    return (
      <Lookup className={cnUsers()}>
        {!!value.length && (
          <LookupList multiple={multiple} numerous={numerous} editable={editable}>
            {value.map((item, i) => {
              return (
                <UsersItem
                  item={item}
                  onDelete={this.deleteHandler}
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
          <UsersAdd multiple={multiple} filled={Boolean(value.length)} onChange={this.addHandler} value={value} />
        )}
      </Lookup>
    );
  }

  @boundMethod
  private deleteHandler(deletingItem: MinimizedCrgUser) {
    const { onChange, value } = this.props;
    onChange(value.filter(({ id }) => !(id === deletingItem.id)));
  }

  @boundMethod
  private addHandler(selectedUsers: MinimizedCrgUser[]) {
    const { onChange } = this.props;

    onChange(selectedUsers);
  }
}
