import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { Dataset } from '../../services/data/vectorData/vectorData.models';
import { getDataset } from '../../services/data/vectorData/vectorData.service';
import { ActionTypes, DataTypes, Role } from '../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../services/permissions/permissions.utils';
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
  @observable private dataset?: Dataset;
  private operationId?: symbol;

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
    const owningAllowed = currentUser.isAdmin || this.dataset?.role === Role.OWNER;
    const editAllowed = owningAllowed || this.dataset?.role === Role.CONTRIBUTOR;

    return this.dataset ? (
      <div className={cnDatasetActions()}>
        <DatasetActionsEdit
          dataset={this.dataset}
          disabled={!editAllowed}
          tooltipText={
            editAllowed
              ? undefined
              : getAvailableActionsTooltipByRole(ActionTypes.EDIT, this.dataset.role, DataTypes.DATASET)
          }
        />
        <DatasetActionsAddToProject dataset={this.dataset} />
        <DatasetActionsDelete
          dataset={this.dataset}
          disabled={!owningAllowed}
          tooltipText={
            owningAllowed
              ? undefined
              : getAvailableActionsTooltipByRole(ActionTypes.DELETE, this.dataset.role, DataTypes.DATASET)
          }
        />
      </div>
    ) : null;
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
