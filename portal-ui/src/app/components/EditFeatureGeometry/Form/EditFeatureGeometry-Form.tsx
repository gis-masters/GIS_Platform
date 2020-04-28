import React from 'react';
import { IClassNameProps } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryError } from '../Error/EditFeatureGeometry-Error';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form.scss';

export const cnEditFeatureGeometryForm = cn('EditFeatureGeometry', 'Form');

export interface EditFeatureGeometryFormProps extends IClassNameProps {
  type: GeometryType;
  store: EditFeatureGeometryStore;
}

export class EditFeatureGeometryForm extends React.Component<EditFeatureGeometryFormProps> {
  render () {
    return (
      <div className={cnEditFeatureGeometryForm()}>
        <EditFeatureGeometryError>
          Неподдерживаемый тип геометрии: {this.props.store.geometry.type}
        </EditFeatureGeometryError>
      </div>
    );
  }
}
