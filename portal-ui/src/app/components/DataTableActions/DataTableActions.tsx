import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { DataTable, getDataTable } from '../../services/data.service';
import { Role } from '../../services/crg/permissions.models';

import { DataTableActionsDelete } from './Delete/DataTableActions-Delete';
import { DataTableActionsEdit } from './Edit/DataTableActions-Edit';

const cnDataTableActions = cn('DataTableActions');

interface DataTableActionsProps {
  dataTable: DataTable;
}

@observer
export class DataTableActions extends Component<DataTableActionsProps> {
  @observable private dataTable: DataTable;
  private operationId: symbol;

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: DataTableActionsProps) {
    if (!isEqual(this.props.dataTable, prevProps.dataTable)) {
      await this.init();
    }
  }

  render() {
    const actionAllowed = currentUser.isAdmin || this.dataTable?.role === Role.OWNER;

    return (
      <div className={cnDataTableActions()}>
        {actionAllowed && this.dataTable && (
          <>
            <DataTableActionsEdit dataTable={this.dataTable} />
            <DataTableActionsDelete dataTable={this.dataTable} />
          </>
        )}
      </div>
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { dataTable } = this.props;

    dataTable = dataTable.role ? dataTable : await getDataTable(dataTable.dataset, dataTable.identifier);

    if (this.operationId === operationId) {
      this.setDataTable(dataTable);
    }
  }

  @action
  private setDataTable(dataTable: DataTable) {
    this.dataTable = dataTable;
  }
}
