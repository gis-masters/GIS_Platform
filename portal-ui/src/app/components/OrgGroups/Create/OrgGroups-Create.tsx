import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { GroupAdd, GroupAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { OrgGroupsCreateEditDialog } from '../../OrgGroupCreateEditDialog/OrgGroupsCreateEditDialog';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./OrgGroups-Create.scss';

const cnOrgGroups = cn('OrgGroups', 'Create');

@observer
export class OrgGroupsCreate extends Component {
  @observable private dialogOpen = false;

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
