import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { GeometryType } from '../../../services/geoserver/wfs.models';

import { EditFeatureGeometryError } from '../Error/EditFeatureGeometry-Error';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-View.scss';

export const cnEditFeatureGeometryView = cn('EditFeatureGeometry', 'View');

export interface EditFeatureGeometryViewProps extends IClassNameProps {
  store: EditFeatureGeometryStore;
  type: GeometryType;
}

export const EditFeatureGeometryView: FC<EditFeatureGeometryViewProps> = ({ store, className }) => (
  <div className={cnEditFeatureGeometryView(null, [className])}>
    <EditFeatureGeometryError>Неподдерживаемый тип геометрии: {store.geometry?.type}</EditFeatureGeometryError>
  </div>
);
