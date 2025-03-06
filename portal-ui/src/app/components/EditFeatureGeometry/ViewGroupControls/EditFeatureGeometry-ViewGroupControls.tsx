import React, { FC, RefObject } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';

import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryCopy } from '../Copy/EditFeatureGeometry-Copy';
import { EditFeatureGeometryCSV } from '../CSV/EditFeatureGeometry-CSV';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewGroupControls.scss';

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
