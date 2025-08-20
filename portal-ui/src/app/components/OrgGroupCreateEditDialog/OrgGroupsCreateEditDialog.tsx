import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { groupsService } from '../../services/auth/groups/groups.service';
import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';
import { Toast } from '../Toast/Toast';

interface OrgGroupsCreateEditDialogProps {
  open: boolean;
  create?: boolean;
  group?: CrgGroup;
  onClose(): void;
}

@observer
export class OrgGroupsCreateEditDialog extends Component<OrgGroupsCreateEditDialogProps> {
  constructor(props: OrgGroupsCreateEditDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, group, onClose } = this.props;

    return (
      <FormDialog
        open={open}
        schema={{ properties: this.groupProperties }}
        value={group}
        actionFunction={this.create}
        actionButtonProps={{ children: group ? 'Обновить' : 'Создать' }}
        onClose={onClose}
        closeWithConfirm
      />
    );
  }

  @computed
  private get groupProperties(): PropertySchema[] {
    const userInfo = [
      {
        name: 'name',
        title: 'Название группы:',
        required: true,
        propertyType: PropertyType.STRING
      },
      {
        name: 'description',
        title: 'Описание',
        propertyType: PropertyType.STRING
      }
    ];

    return userInfo as PropertySchema[];
  }

  @boundMethod
  private async create(groupData: CrgGroup) {
    const { group, onClose } = this.props;

    try {
      if (group) {
        await groupsService.update(groupData);
      }

      if (!group) {
        await groupsService.create(groupData);
      }
    } catch (error) {
      Toast.error(error as AxiosError);

      return;
    }

    onClose();
  }
}
