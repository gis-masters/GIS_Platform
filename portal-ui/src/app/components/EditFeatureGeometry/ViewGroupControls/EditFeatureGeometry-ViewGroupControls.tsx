import React, { type FC, type RefObject } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type Coordinate } from 'ol/coordinate';

import { editFeatureStore } from '../../../stores/EditFeature.store';
import { EditFeatureGeometryCopy } from '../Copy/EditFeatureGeometry-Copy';
import { EditFeatureGeometryCSV } from '../CSV/EditFeatureGeometry-CSV';

import './EditFeatureGeometry-ViewGroupControls.scss';

const cnEditFeatureGeometryViewGroupControls = cn('EditFeatureGeometry', 'ViewGroupControls');

interface EditFeatureGeometryViewGroupControlsProps {
  coordinates: Coordinate[];
  tableRef: RefObject<HTMLTableElement>;
  index: number;
}

export const EditFeatureGeometryViewGroupControls: FC<EditFeatureGeometryViewGroupControlsProps> = ({
  coordinates,
  tableRef,
  index
}) =>
  !!editFeatureStore.geometryType && (
    <Paper className={cnEditFeatureGeometryViewGroupControls()} square>
      <EditFeatureGeometryCopy
        coordinates={coordinates}
        tableRef={tableRef}
        geometryType={editFeatureStore.geometryType}
        first={!index}
      />
      <EditFeatureGeometryCSV
        coordinates={coordinates}
        readOnly
        geometryType={editFeatureStore.geometryType}
        first={!index}
      />
    </Paper>
  );
