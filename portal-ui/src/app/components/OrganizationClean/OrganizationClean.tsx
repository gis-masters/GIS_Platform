import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';

import { Button } from '../Button/Button';
import {
  deleteFeatureTypeFromScratchDatastore,
  FeatureTypeHref,
  getFeatureTypesFromScratchDatastore
} from '../../services/geoserver/geoserver-clean.service';
import { Toast } from '../Toast/Toast';
import { sleep } from '../../services/util/sleep';

@observer
export class OrganizationClean extends Component {
  @observable private busy = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

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
