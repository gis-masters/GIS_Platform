import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { GpkgPlacementDialogTableNameHint } from '../TableNameHint/GpkgPlacementDialog-TableNameHint';

import './GpkgPlacementDialog-TableNameCellContent.scss';

const cnGpkgPlacementDialogTableNameCellContent = cn('GpkgPlacementDialog', 'TableNameCellContent');

interface GpkgPlacementDialogTableNameCellContentProps {
  rowData: {
    tableName: string;
    description: string;
    importFailure?: string;
  };
}

export const GpkgPlacementDialogTableNameCellContent: FC<GpkgPlacementDialogTableNameCellContentProps> = ({
  rowData
}) => (
  <span className={cnGpkgPlacementDialogTableNameCellContent()}>
    {rowData.tableName}
    {rowData.description && <GpkgPlacementDialogTableNameHint title={rowData.description} />}
    {rowData.importFailure && <GpkgPlacementDialogTableNameHint title={rowData.importFailure} error />}
  </span>
);
