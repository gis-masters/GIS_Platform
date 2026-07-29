import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../stores/EditFeature.store';
import { EditFeatureGeometryError } from '../Error/EditFeatureGeometry-Error';

import './EditFeatureGeometry-Form.scss';

export const cnEditFeatureGeometryForm = cn('EditFeatureGeometry', 'Form');

export interface EditFeatureGeometryFormProps extends IClassNameProps {
  type: GeometryType;
}

export class EditFeatureGeometryFormBase extends Component<EditFeatureGeometryFormProps> {
  render() {
    return (
      <div className={cnEditFeatureGeometryForm()}>
        <EditFeatureGeometryError>
          Неподдерживаемый тип геометрии: {editFeatureStore.geometry?.type}
        </EditFeatureGeometryError>
      </div>
    );
  }
}
