import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogActions
} from '@material-ui/core';
import { isEqual } from 'lodash';
import { cn } from '@bem-react/classname';
import { People } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { CrgUser } from '../../../services/crg/users.service';
import { CrgGroup, groupsService } from '../../../services/crg/groups.service';
import { groupsList } from '../../../stores/GroupsList.store';
import { Loading } from '../../Loading/Loading';
import { IdBadge } from '../../IdBadge/IdBadge';
import { Button } from '../../Button/Button';

import { OrgActionsUserGroupCheck } from '../UserGroupCheck/OrgActions-UserGroupCheck';

const cnOrgActionsGroups = cn('OrgActions', 'Groups');

interface OrgActionsGroupsProps {
  user: CrgUser;
  userGroups: CrgGroup[];
}

@observer
export class OrgActionsGroups extends Component<OrgActionsGroupsProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private selected: CrgGroup[] = [];

  render() {
    const { user } = this.props;

    return (
      <>
        <Tooltip title='Группы'>
          <IconButton className={cnOrgActionsGroups()} onClick={this.openDialog}>
            <People />
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Группы пользователя {user.username}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {groupsList.list.map(group => {
                    return (
                      <TableRow key={group.id}>
                        <TableCell padding='checkbox'>
                          <OrgActionsUserGroupCheck group={group} selectedList={this.selected} />
                        </TableCell>
                        <TableCell>
                          {group.name}
                          <IdBadge id={group.id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            {this.groupsChanged && (
              <Button onClick={this.saveGroups} color='primary'>
                Сохранить
              </Button>
            )}
            <Button onClick={this.closeDialog}>{this.groupsChanged ? 'Отмена' : 'Закрыть'}</Button>
          </DialogActions>
        </Dialog>

        <Loading visible={this.loading} global />
      </>
    );
  }

  @computed
  private get groupsChanged(): boolean {
    return !isEqual(this.selected, this.props.userGroups);
  }

  @action.bound
  private openDialog() {
    this.selected = [...this.props.userGroups];
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async saveGroups() {
    this.setLoading(true);

    const { userGroups, user } = this.props;
    const selectedGroups = [...this.selected];

    for (let group of userGroups) {
      if (selectedGroups.includes(group)) {
        selectedGroups.splice(selectedGroups.indexOf(group), 1);
      } else {
        await groupsService.removeUserFromGroup(user, group);
      }
    }

    for (let group of selectedGroups) {
      await groupsService.addUserToGroup(user, group);
    }

    this.closeDialog();
    this.setLoading(false);
  }

  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
