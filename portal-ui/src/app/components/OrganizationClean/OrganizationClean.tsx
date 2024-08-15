import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';

import { FeatureTypeHref } from '../../services/geoserver/featureType/featureType.model';
import {
  deleteFeatureTypeFromScratchDatastore,
  getFeatureTypesFromScratchDatastore
} from '../../services/geoserver/featureType/featureType.service';
import { sleep } from '../../services/util/sleep';
import { currentUser } from '../../stores/CurrentUser.store';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

@observer
export class OrganizationClean extends Component {
  @observable private busy = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Tooltip title='Очистка предназначена для удаления временных слоев после импорта'>
        <Button loading={this.busy} color='primary' onClick={this.cleanUp}>
          Очистить дефолтные слои
        </Button>
      </Tooltip>
    );
  }

  @action.bound
  private async cleanUp() {
    this.setBusy(true);

    const { workspaceName, datastoreName } = currentUser;
    const featureTypeHrefs: FeatureTypeHref[] | undefined = await getFeatureTypesFromScratchDatastore(
      workspaceName,
      datastoreName
    );

    if (featureTypeHrefs) {
      for (const item of featureTypeHrefs) {
        await deleteFeatureTypeFromScratchDatastore(workspaceName, datastoreName, item.name);
        await sleep(55);
      }

      Toast.success({ message: 'Готово' });
    } else {
      Toast.success({ message: 'Готово' });
    }

    this.setBusy(false);
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
