import React from 'react';
import { IClassNameProps } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryFormProps extends IClassNameProps {
  type: GeometryType;
  store: EditFeatureGeometryStore;
}

export class EditFeatureGeometryForm extends React.Component<EditFeatureGeometryFormProps> {
  render () {
    return (
      <div className={cnEditFeatureGeometry('Form')}>
        <div className={cnEditFeatureGeometry('Error')}>
          Неподдерживаемый тип геометрии: {this.props.store.geometry.type}
        </div>
      </div>
    );
  }
}
