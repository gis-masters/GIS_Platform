import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Tooltip } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { groupsService } from '../../../services/auth/groups/groups.service';
import { CrgUser } from '../../../services/auth/users/users.models';
import { usersService } from '../../../services/auth/users/users.service';
import { Button } from '../../Button/Button';
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
          <IconButton className={cnOrgActionsDel()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogContent>
            <DialogContentText>Удалить?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.delete} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <Loading visible={this.loading} global />
      </>
    );
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
  private async delete() {
    const { user, group } = this.props;
    this.setLoading(true);
    this.closeDialog();

    if (user) {
      await usersService.delete(user);
    }

    if (group) {
      await groupsService.delete(group);
    }

    this.setLoading(false);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
