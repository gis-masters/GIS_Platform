import React, { Component } from 'react';
import { Person } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MinimizedCrgUser } from '../../../services/auth/users/users.models';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';

const cnUsersItem = cn('Users', 'Item');

interface UsersItemProps {
  item: MinimizedCrgUser;
  editable: boolean;
  numerous: boolean;
  multiple: boolean;
  onDelete(item: MinimizedCrgUser): void;
}

export class UsersItem extends Component<UsersItemProps> {
  constructor(props: UsersItemProps) {
    super(props);
  }

  render() {
    const { item, editable, numerous, multiple, onDelete } = this.props;
    const Icon = Person;

    return (
      <>
        <LookupItem className={cnUsersItem({ numerous })}>
          <LookupIcon>
            <Icon color='action' />
          </LookupIcon>
          {item.surname} {item.name} {item.middleName}
          {editable && (numerous || multiple) && <LookupNameGap />}
          {editable && (
            <LookupActions>
              <LookupDelete<MinimizedCrgUser> item={item} onDelete={onDelete} />
            </LookupActions>
          )}
        </LookupItem>
      </>
    );
  }
}
