import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { ActionTypes, DataTypes, Role } from '../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../services/permissions/permissions.utils';
import { currentUser } from '../../stores/CurrentUser.store';
import { SchemaActionsEdit } from '../SchemaActions/Edit/SchemaActions-Edit';
import { VectorTableActionsDelete } from './Delete/VectorTableActions-Delete';
import { VectorTableActionsEdit } from './Edit/VectorTableActions-Edit';

const cnVectorTableActions = cn('VectorTableActions');

interface VectorTableActionsProps {
  vectorTable: VectorTable;
}

@observer
export class VectorTableActions extends Component<VectorTableActionsProps> {
  @observable private vectorTable?: VectorTable;
  private operationId?: symbol;

  constructor(props: VectorTableActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: VectorTableActionsProps) {
    if (!isEqual(this.props.vectorTable, prevProps.vectorTable)) {
      await this.init();
    }
  }

  render() {
    const owninAllowed = currentUser.isAdmin || this.vectorTable?.role === Role.OWNER;

    return (
      <div className={cnVectorTableActions()}>
        {this.vectorTable && (
          <VectorTableActionsEdit
            vectorTable={this.vectorTable}
            disabled={!owninAllowed}
            tooltipText={
              owninAllowed
                ? undefined
                : getAvailableActionsTooltipByRole(ActionTypes.EDIT, this.vectorTable.role, DataTypes.VECTOR_TABLE)
            }
          />
        )}
        {this.vectorTable && (
          <SchemaActionsEdit
            withPreview
            readonly={!owninAllowed}
            item={this.vectorTable}
            schema={this.vectorTable.schema}
            as='iconButton'
            disabled={!owninAllowed}
            tooltipText={
              owninAllowed
                ? undefined
                : getAvailableActionsTooltipByRole(ActionTypes.EDIT, this.vectorTable.role, DataTypes.VECTOR_TABLE)
            }
          />
        )}
        {this.vectorTable && (
          <VectorTableActionsDelete
            vectorTable={this.vectorTable}
            disabled={!owninAllowed}
            tooltipText={
              owninAllowed
                ? undefined
                : getAvailableActionsTooltipByRole(ActionTypes.DELETE, this.vectorTable.role, DataTypes.VECTOR_TABLE)
            }
          />
        )}
      </div>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { vectorTable } = this.props;

    vectorTable = vectorTable.role ? vectorTable : await getVectorTable(vectorTable.dataset, vectorTable.identifier);

    if (this.operationId === operationId) {
      this.setVectorTable(vectorTable);
    }
  }

  @action
  private setVectorTable(vectorTable: VectorTable) {
    this.vectorTable = vectorTable;
  }
}
