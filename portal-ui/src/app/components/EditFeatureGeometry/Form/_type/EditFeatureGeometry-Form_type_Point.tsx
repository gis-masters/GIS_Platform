import React from 'react';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';

import { WfsPointGeometry } from '../../../../services/geoserver/wfs-models';

import { EditFeatureGeometryFormProps, EditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form_type_Point.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryForm {
  constructor (props: EditFeatureGeometryFormProps) {
    super(props);
  }

  render () {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsPointGeometry;

    return (
      <div className={cnEditFeatureGeometry('Form', [className])}>
        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} store={store} />
      </div>
    );
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometry('Form'),
  { type: GeometryType.POINT },
  () => props => <EditFeatureGeometryFormTypePoint {...props} />
);
