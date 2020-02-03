import * as React from 'react';
import { IClassNameProps } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';
import { cn } from '@bem-react/classname';

import { WfsGeometryEdited } from '../../../services/geoserver/wfs-models';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export interface EditFeatureGeometryFormProps extends IClassNameProps {
  type: GeometryType;
  geometry: WfsGeometryEdited;
}

export class EditFeatureGeometryForm extends React.Component<EditFeatureGeometryFormProps> {
  render () {
    return (
      <div className={cnEditFeatureGeometry('Form')}>
        <div className={cnEditFeatureGeometry('Error')}>
          Неподдерживаемый тип геометрии: {this.props.geometry.type}
        </div>
      </div>
    );
  }
}
