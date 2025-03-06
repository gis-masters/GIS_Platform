import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryError } from '../Error/EditFeatureGeometry-Error';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-View.scss';

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
