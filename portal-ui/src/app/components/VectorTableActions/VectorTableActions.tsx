import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { Role } from '../../services/data/permissions/permissions.models';

import { VectorTableActionsDelete } from './Delete/VectorTableActions-Delete';
import { VectorTableActionsEdit } from './Edit/VectorTableActions-Edit';
import { OpenSchemaAction } from '../OpenSchemaAction/OpenSchemaAction';

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
    const actionAllowed = currentUser.isAdmin || this.vectorTable?.role === Role.OWNER;

    return (
      <div className={cnVectorTableActions()}>
        {this.vectorTable && <OpenSchemaAction readonly schema={this.vectorTable.schema} />}
        {actionAllowed && this.vectorTable && (
          <>
            <VectorTableActionsEdit vectorTable={this.vectorTable} />
            <VectorTableActionsDelete vectorTable={this.vectorTable} />
          </>
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
