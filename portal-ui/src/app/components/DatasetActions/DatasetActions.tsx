import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { Dataset, getDataset } from '../../services/data.service';
import { Role } from '../../services/crg/permissions.models';

import { DatasetActionsDelete } from './Delete/DatasetActions-Delete';

const cnDatasetActions = cn('DatasetActions');

interface DatasetActionsProps {
  dataset: Dataset;
}

@observer
export class DatasetActions extends Component<DatasetActionsProps> {
  @observable private dataset: Dataset;
  private operationId: symbol;

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: DatasetActionsProps) {
    if (!isEqual(this.props.dataset, prevProps.dataset)) {
      await this.init();
    }
  }

  render() {
    const deletionAllowed = currentUser.isAdmin || this.dataset?.role === Role.OWNER;

    return (
      <div className={cnDatasetActions()}>{deletionAllowed && <DatasetActionsDelete dataset={this.dataset} />}</div>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { dataset } = this.props;

    dataset = dataset.role ? dataset : await getDataset(dataset.identifier);

    if (this.operationId === operationId) {
      this.setDataset(dataset);
    }
  }

  @action
  private setDataset(dataset: Dataset) {
    this.dataset = dataset;
  }
}
