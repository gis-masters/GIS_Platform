import React, { type FC } from 'react';
import { Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

const cnGpkgPlacementDialogFeatureCountCellContent = cn('GpkgPlacementDialog', 'FeatureCountCellContent');

interface GpkgPlacementDialogFeatureCountCellContentProps {
  rowData: {
    featureCount: number | null;
  };
}

export const GpkgPlacementDialogFeatureCountCellContent: FC<GpkgPlacementDialogFeatureCountCellContentProps> = ({
  rowData
}) => (
  <span className={cnGpkgPlacementDialogFeatureCountCellContent()}>
    {rowData.featureCount === null ? (
      <Typography
        component='span'
        variant='body2'
        sx={{
          color: 'text.disabled'
        }}
      >
        —
      </Typography>
    ) : (
      rowData.featureCount
    )}
  </span>
);
