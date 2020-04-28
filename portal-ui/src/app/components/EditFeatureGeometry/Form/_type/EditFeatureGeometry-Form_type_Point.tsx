import React from 'react';
import { withBemMod } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';

import { WfsPointGeometry } from '../../../../services/geoserver/wfs-models';

import { EditFeatureGeometryCoord } from '../../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryXY } from '../../XY/EditFeatureGeometry-XY';
import {
  EditFeatureGeometryFormProps,
  EditFeatureGeometryForm,
  cnEditFeatureGeometryForm
} from '../EditFeatureGeometry-Form';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Form_type_Point.scss';

class EditFeatureGeometryFormTypePoint extends EditFeatureGeometryForm {
  constructor (props: EditFeatureGeometryFormProps) {
    super(props);
  }

  render () {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsPointGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className])}>
        <EditFeatureGeometryXY />
        <EditFeatureGeometryCoord val={geometry.coordinates} store={store} />
      </div>
    );
  }
}

export const withTypePoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.POINT },
  () => props => <EditFeatureGeometryFormTypePoint {...props} />
);
