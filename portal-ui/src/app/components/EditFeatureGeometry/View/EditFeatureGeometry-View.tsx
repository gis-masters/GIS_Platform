import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryError } from '../Error/EditFeatureGeometry-Error';

import './EditFeatureGeometry-View.scss';

export const cnEditFeatureGeometryView = cn('EditFeatureGeometry', 'View');

export interface EditFeatureGeometryViewProps extends IClassNameProps {
  type: GeometryType;
}

export const EditFeatureGeometryViewBase: FC<EditFeatureGeometryViewProps> = ({ className }) => (
  <div className={cnEditFeatureGeometryView(null, [className])}>
    <EditFeatureGeometryError>
      Неподдерживаемый тип геометрии: {editFeatureStore.geometry?.type}
    </EditFeatureGeometryError>
  </div>
);
