import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import { Button } from '../Button/Button';
import {
  deleteFeatureTypeFromScratchDatastore,
  FeatureTypeHref,
  getFeatureTypesFromScratchDatastore
} from '../../services/geoserver-clean.service';
import { Toast } from '../Toast/Toast';
import { sleep } from '../../services/util/sleep';

@observer
export class OrganizationClean extends Component {
  @observable private busy = false;

  render() {
    return (
      <Button loading={this.busy} color='primary' onClick={this.cleanUp}>
        Очистить дефолтные слои
      </Button>
    );
  }

  @action.bound
  private async cleanUp() {
    this.setBusy(true);

    const featureTypeHrefs: FeatureTypeHref[] = await getFeatureTypesFromScratchDatastore();
    if (featureTypeHrefs) {
      for (const item of featureTypeHrefs) {
        await deleteFeatureTypeFromScratchDatastore(item.name);
        await sleep(55);
      }

      Toast.success({ message: 'Done' });
    } else {
      Toast.success({ message: 'Done' });
    }

    this.setBusy(false);
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
