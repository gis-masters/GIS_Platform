import React from 'react';
import { withBemMod } from '@bem-react/core';

import { DataSet, DataTable } from '../../../../services/data.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerInfo, ExplorerInfoProps } from '../Explorer-Info';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { getDescription } from '../../Adapter/Explorer-Adapter';

interface ExplorerInfoTypeDataTableProps {
  type?: ExplorerItemType;
}

function renderContent({ Explorer, store }: ExplorerInfoProps) {
  const { selectedItem, openedItem } = store;
  const dataTable = selectedItem.payload as DataTable;
  // Тут мы наивно предполагаем, что родителями списков таблиц всегда являются наборы данных.
  // Если это окажется не так, нужно будет переделывать.
  const dataSet = openedItem.payload as DataSet;

  return (
    <>
      {getDescription(selectedItem)}
      <ConnectionsTableToProjectsWidget dataTable={dataTable} dataSet={dataSet} Explorer={Explorer} />
      <PermissionsWidget dataTable={dataTable} dataSet={dataSet} />
    </>
  );
}

export const withExplorerInfoTypeDataTable = withBemMod<ExplorerInfoTypeDataTableProps, ExplorerInfoProps>(
  cnExplorerInfo(),
  { type: ExplorerItemType.TABLE },
  ExplorerInfo => props => <ExplorerInfo {...props} renderContent={renderContent} />
);
