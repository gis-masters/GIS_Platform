import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { Role } from '../../services/data/permissions/permissions.models';
import { Dataset } from '../../services/data/vectorData/vectorData.models';
import { getDataset } from '../../services/data/vectorData/vectorData.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { DatasetActionsAddToProject } from './AddToProject/DatasetActions-AddToProject';
import { DatasetActionsDelete } from './Delete/DatasetActions-Delete';
import { DatasetActionsEdit } from './Edit/DatasetActions-Edit';

const cnDatasetActions = cn('DatasetActions');

interface DatasetActionsProps {
  dataset: Dataset;
}

@observer
export class DatasetActions extends Component<DatasetActionsProps> {
  @observable private dataset: Dataset;
  private operationId: symbol;

  constructor(props: DatasetActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: DatasetActionsProps) {
    if (!isEqual(this.props.dataset, prevProps.dataset)) {
      await this.init();
    }
  }

  render() {
    const actionAllowed = currentUser.isAdmin || this.dataset?.role === Role.OWNER;

    return (
      <div className={cnDatasetActions()}>
        {actionAllowed && <DatasetActionsEdit dataset={this.dataset} />}
        <DatasetActionsAddToProject dataset={this.dataset} />
        {actionAllowed && <DatasetActionsDelete dataset={this.dataset} />}
      </div>
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
