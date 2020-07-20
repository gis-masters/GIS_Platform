import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton, Dialog, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { Button } from '../../Button/Button';
import { usersService, CrgUser } from '../../../services/crg/users.service';
import { groupsService, CrgGroup } from '../../../services/crg/groups.service';

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

  render() {
    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnOrgActionsDel()} onClick={this.openDialog}>
            <Delete />
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
  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
