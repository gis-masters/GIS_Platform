import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { Dataset, getDataset } from '../../services/data/data.service';
import { Role } from '../../services/data/permissions.models';

import { DatasetActionsDelete } from './Delete/DatasetActions-Delete';
import { DatasetActionsAddToProject } from './AddToProject/DatasetActions-AddToProject';
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
