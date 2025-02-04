import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { OccupiedStorage } from '../../services/auth/organizations/organizations.models';
import { organizationsService } from '../../services/auth/organizations/organizations.service';
import { organizationSettings } from '../../stores/OrganizationSettings.store';

const cnRunningOutOfSpace = cn('RunningOutOfSpace');

@observer
export class RunningOutOfSpace extends Component {
  @observable private occupiedStorage?: OccupiedStorage;

  async componentDidMount(): Promise<void> {
    const occupiedStorage = await organizationsService.getOrganizationOccupiedStorage();
    organizationSettings.setOccupiedStorage(occupiedStorage);

    setInterval(async () => {
      const occupiedStorage = await organizationsService.getOrganizationOccupiedStorage();
      organizationSettings.setOccupiedStorage(occupiedStorage);
      this.handleClick(occupiedStorage);
    }, 60_000);
  }

  render() {
    return (
      this.showWarning && (
        <Tooltip title='В файловом хранилище осталось менее 10% свободного места'>
          <IconButton className={cnRunningOutOfSpace()} color='inherit'>
            <WarningAmber color='warning' />
          </IconButton>
        </Tooltip>
      )
    );
  }

  @action.bound
  private handleClick(occupiedStorage: OccupiedStorage) {
    this.occupiedStorage = occupiedStorage;
  }

  @computed
  private get showWarning() {
    const allocated = this.occupiedStorage?.allocated || organizationSettings.occupiedStorageInfo?.allocated;

    if (allocated) {
      const [size, type] = allocated.split(' ');
      const storageSize = organizationSettings.orgSettings?.system?.storageSize;

      if (type === 'Mb' && storageSize) {
        return Number(size) >= storageSize * 1024 * 0.9;
      }

      if (type === 'Gb' && storageSize) {
        return Number(size) >= storageSize * 0.9;
      }
    }

    return false;
  }
}
