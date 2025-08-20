import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { GroupAdd, GroupAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../../stores/CurrentUser.store';
import { Button } from '../../Button/Button';
import { OrgGroupsCreateEditDialog } from '../../OrgGroupCreateEditDialog/OrgGroupsCreateEditDialog';

import '!style-loader!css-loader!sass-loader!./OrgGroups-Create.scss';

const cnOrgGroups = cn('OrgGroups', 'Create');

@observer
export class OrgGroupsCreate extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        {currentUser.isAdmin && (
          <Button
            className={cnOrgGroups()}
            startIcon={this.dialogOpen ? <GroupAdd /> : <GroupAddOutlined />}
            onClick={this.openDialog}
            variant='text'
          >
            Создать группу
          </Button>
        )}
        <OrgGroupsCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} />
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
}
