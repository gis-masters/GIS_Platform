import React from 'react';
import { withBemMod } from '@bem-react/core';

import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { DataSet, DataTable } from '../../../../services/data.service';

import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerInfo, ExplorerInfoProps } from '../Explorer-Info';

interface ExplorerInfoTypeDataTableProps {
  type?: ExplorerItemType;
}

function renderContent(props: ExplorerInfoProps) {
  const { selectedItem, currentItem } = props.store;
  const dataTable = selectedItem.payload as DataTable;
  // Тут мы наивно предполагаем, что родителями списков таблиц всегда являются наборы данных.
  // Если это окажется не так, нужно будет переделывать.
  const dataSet = currentItem.payload as DataSet;

  return <PermissionsWidget dataTable={dataTable} dataSet={dataSet} />;
}

export const withExplorerInfoTypeDataTable = withBemMod<ExplorerInfoTypeDataTableProps, ExplorerInfoProps>(
  cnExplorerInfo(),
  { type: ExplorerItemType.TABLE },
  ExplorerInfo => props => <ExplorerInfo {...props} renderContent={renderContent} />
);
