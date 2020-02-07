import React from 'react';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';

import { WfsPointGeometry } from '../../../../services/geoserver/wfs-models';

import { EditFeatureGeometryFormProps, EditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryForm {
  constructor (props: EditFeatureGeometryFormProps) {
    super(props);
  }

  render () {
    const { className } = this.props;
    const geometry = this.props.geometry as WfsPointGeometry;

    return (
      <div className={cnEditFeatureGeometry('Form', [className])}>
        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} />
      </div>
    );
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometry('Form'),
  { type: GeometryType.POINT },
  () => props => <EditFeatureGeometryFormTypePoint {...props} />
);
