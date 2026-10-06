import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type GpkgContentsBaseDtoUnion } from '../../../../server-types/common-contracts';
import {
  type GpkgPlacement,
  type GpkgPlacementOutcome
} from '../../../services/data/file-placement/gpkg-import.service';
import { ChooseXTable } from '../../ChooseXTable/ChooseXTable';
import { type XTableColumn } from '../../XTable/XTable.models';
import { GpkgPlacementDialogActions } from '../Actions/GpkgPlacementDialog-Actions';
import { GpkgPlacementDialogFeatureCountCellContent } from '../FeatureCountCellContent/GpkgPlacementDialog-FeatureCountCellContent';
import { GpkgPlacementDialogTableNameCellContent } from '../TableNameCellContent/GpkgPlacementDialog-TableNameCellContent';
import { GpkgPlacementDialogTypeIcon } from '../TypeIcon/GpkgPlacementDialog-TypeIcon';

import './GpkgPlacementDialog-Table.scss';

const cnGpkgPlacementDialogTable = cn('GpkgPlacementDialog', 'Table');

export type GpkgLayerPlacementStatus = 'importing' | 'placed';

export interface GpkgImportLayerTableRow {
  payloadIndex: number;
  tableName: string;
  description: string;
  dataType: GpkgContentsBaseDtoUnion['dataType'];
  featureCount: number | null;
  sriId: number;
  fileId?: string;
  placementStatus?: GpkgLayerPlacementStatus;
  importFailure?: string;
  setPlacementStatus?(status: GpkgLayerPlacementStatus | undefined): void;
  noteImportFailure?(error?: unknown): void;
  ensureSessionLayerGroup?(): Promise<number>;
  forgetSessionLayerGroupIfUnused?(): void;
  autoDatasetExists?: boolean;
  chooseAutoDataset?(): void;
  forgetAutoDatasetChoice?(): void;
  ensureAutoDatasetPlacement?(placement: GpkgPlacement): Promise<GpkgPlacementOutcome>;
}

function getGpkgImportLayerRowId({ payloadIndex }: GpkgImportLayerTableRow): string {
  return `gpkg-${payloadIndex}`;
}

function gpkgLayerDisabledTester(row: GpkgImportLayerTableRow): boolean | string {
  if (row.placementStatus === 'placed') {
    return 'Слой уже размещён';
  }

  if (row.placementStatus === 'importing') {
    return 'Слой импортируется';
  }

  return false;
}

interface GpkgPlacementDialogTypeCellProps {
  rowData: Pick<GpkgImportLayerTableRow, 'dataType'>;
}

const GpkgPlacementDialogTypeCell: FC<GpkgPlacementDialogTypeCellProps> = ({ rowData }) => (
  <GpkgPlacementDialogTypeIcon type={rowData.dataType === 'TILES' ? 'raster' : 'vector'} />
);

const layerTableCols: XTableColumn<GpkgImportLayerTableRow>[] = [
  {
    field: 'tableName',
    title: 'Наименование',
    filterable: true,
    sortable: true,
    CellContent: GpkgPlacementDialogTableNameCellContent
  },
  {
    field: 'featureCount',
    title: 'Кол-во',
    align: 'right',
    sortable: true,
    CellContent: GpkgPlacementDialogFeatureCountCellContent
  },
  {
    title: 'Тип',
    align: 'center',
    CellContent: GpkgPlacementDialogTypeCell
  },
  {
    field: 'sriId',
    title: 'SRID',
    description: 'Идентификатор системы координат',
    align: 'center',
    sortable: true
  },
  {
    title: '',
    align: 'right',
    CellContent: GpkgPlacementDialogActions
  }
];

interface GpkgPlacementDialogTableProps {
  data: GpkgImportLayerTableRow[];
  selectedItems: GpkgImportLayerTableRow[];
  onSelect(items: GpkgImportLayerTableRow[]): void;
}

export const GpkgPlacementDialogTable: FC<GpkgPlacementDialogTableProps> = ({ data, selectedItems, onSelect }) => {
  return (
    <ChooseXTable<GpkgImportLayerTableRow>
      className={cnGpkgPlacementDialogTable()}
      cols={layerTableCols}
      data={data}
      defaultSort={{ field: 'tableName', asc: true }}
      filterable
      getRowId={getGpkgImportLayerRowId}
      selectedItems={selectedItems}
      disabledTester={gpkgLayerDisabledTester}
      onSelect={onSelect}
    />
  );
};
