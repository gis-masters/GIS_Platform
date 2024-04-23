import React, { FC, RefObject } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { EditFeatureGeometryCopy } from '../Copy/EditFeatureGeometry-Copy';
import { EditFeatureGeometryCSV } from '../CSV/EditFeatureGeometry-CSV';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewGroupControls.scss';

const cnEditFeatureGeometryViewGroupControls = cn('EditFeatureGeometry', 'ViewGroupControls');

interface EditFeatureGeometryViewGroupControlsProps {
  coordinates: Coordinate[];
  tableRef: RefObject<HTMLTableElement>;
  store: EditFeatureGeometryStore;
  index: number;
}

export const EditFeatureGeometryViewGroupControls: FC<EditFeatureGeometryViewGroupControlsProps> = ({
  coordinates,
  tableRef,
  store,
  index
}) => (
  <Paper className={cnEditFeatureGeometryViewGroupControls()} square>
    <EditFeatureGeometryCopy
      coordinates={coordinates}
      tableRef={tableRef}
      geometryType={store.geometryType}
      first={!index}
    />
    <EditFeatureGeometryCSV coordinates={coordinates} readOnly geometryType={store.geometryType} first={!index} />
  </Paper>
);
