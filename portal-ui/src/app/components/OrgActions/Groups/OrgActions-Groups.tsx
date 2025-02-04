import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, IconButton, Tooltip } from '@mui/material';
import { People, PeopleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { groupsService } from '../../../services/auth/groups/groups.service';
import { CrgUser } from '../../../services/auth/users/users.models';
import { allGroups } from '../../../stores/AllGroups.store';
import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';
import { XTable } from '../../XTable/XTable';
import { XTableColumn } from '../../XTable/XTable.models';
import { OrgActionsUserGroupCheck } from '../UserGroupCheck/OrgActions-UserGroupCheck';

import '!style-loader!css-loader!sass-loader!../GroupsTable/OrgActions-GroupsTable.scss';

const cnOrgActionsGroups = cn('OrgActions', 'Groups');
const cnOrgActionsGroupsTable = cn('OrgActions', 'GroupsTable');

interface OrgActionsGroupsProps {
  user: CrgUser;
  userGroups: CrgGroup[];
}

@observer
export class OrgActionsGroups extends Component<OrgActionsGroupsProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private selected: CrgGroup[] = [];
  private cols: XTableColumn<CrgGroup>[] = [
    {
      cellProps: { padding: 'checkbox' },
      CellContent: this.renderCheckbox
    },
    {
      title: 'Название',
      field: 'name',
      getIdBadge: ({ id }) => id,
      filterable: true,
      sortable: true
    }
  ];

  constructor(props: OrgActionsGroupsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { user } = this.props;

    return (
      <>
        <Tooltip title='Группы'>
          <IconButton className={cnOrgActionsGroups()} onClick={this.openDialog}>
            {this.dialogOpen ? <People /> : <PeopleOutline />}
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogContent>
            <XTable
              className={cnOrgActionsGroupsTable()}
              title={`Группы пользователя ${user.login}`}
              data={allGroups.list}
              cols={this.cols}
              defaultSort={{ field: 'name', asc: true }}
              secondarySortField='id'
              filterable
            />
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

    for (const group of userGroups) {
      if (selectedGroups.includes(group)) {
        selectedGroups.splice(selectedGroups.indexOf(group), 1);
      } else {
        await groupsService.removeUserFromGroup(user, group);
      }
    }

    for (const group of selectedGroups) {
      await groupsService.addUserToGroup(user, group);
    }

    this.closeDialog();
    this.setLoading(false);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private renderCheckbox({ rowData }: { rowData: CrgGroup }): ReactElement {
    return <OrgActionsUserGroupCheck group={rowData} selectedList={this.selected} />;
  }
}
