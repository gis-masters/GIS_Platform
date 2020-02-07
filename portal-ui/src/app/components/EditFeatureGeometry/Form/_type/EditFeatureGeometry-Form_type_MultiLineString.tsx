import React from 'react';
import GeometryType from 'ol/geom/GeometryType';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import {
  WfsMultiLineStringGeometry
} from '../../../../services/geoserver/wfs-models';

import { EditFeatureGeometryFormProps, EditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

class EditFeatureGeometryFormTypeMultiLineString extends EditFeatureGeometryForm {
  render () {
    const geometry = this.props.geometry as WfsMultiLineStringGeometry;

    return (
      <div className={this.props.className}>
        <EditFeatureGeometrySuperGroup
            geometryPart={geometry.coordinates}
            minCoordsPerGroup={2}
            index={0}
        />
      </div>
    );
  }
}

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometry('Form'),
  { type: GeometryType.MULTI_LINE_STRING },
  () => props => <EditFeatureGeometryFormTypeMultiLineString {...props} />
);
