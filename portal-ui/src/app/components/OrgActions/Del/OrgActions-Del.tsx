import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { groupsService } from '../../../services/auth/groups/groups.service';
import { CrgUser } from '../../../services/auth/users/users.models';
import { usersService } from '../../../services/auth/users/users.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { Loading } from '../../Loading/Loading';

const cnOrgActionsDel = cn('OrgActions', 'Del');

interface OrgActionsDelProps {
  user?: CrgUser;
  group?: CrgGroup;
}

@observer
export class OrgActionsDel extends Component<OrgActionsDelProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;

  constructor(props: OrgActionsDelProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnOrgActionsDel()} onClick={this.handleDelete} color='error'>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>
        <Loading visible={this.loading} global />
      </>
    );
  }

  @boundMethod
  private async handleDelete() {
    this.setDialogOpen(true);
    const shouldDelete = await konfirmieren({
      title: 'Подтверждение удаления',
      message: this.props.user
        ? 'Вы уверены, что хотите удалить этого пользователя?'
        : 'Вы уверены, что хотите удалить эту группу?',
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (!shouldDelete) {
      this.setDialogOpen(false);

      return;
    }

    const { user, group } = this.props;
    this.setLoading(true);

    try {
      if (user) {
        await usersService.delete(user);
      }

      if (group) {
        await groupsService.delete(group);
      }
    } finally {
      this.setLoading(false);
      this.setDialogOpen(false);
    }
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private setDialogOpen(open: boolean) {
    this.dialogOpen = open;
  }
}
