import React from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import {
  EditFeatureGeometryFormProps,
  EditFeatureGeometryForm,
  cnEditFeatureGeometryForm
} from '../EditFeatureGeometry-Form';

class EditFeatureGeometryFormTypeMultiLineString extends EditFeatureGeometryForm {
  render() {
    const { store, className } = this.props;
    const geometry = store.geometry as WfsMultiLineStringGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometrySuperGroup
          geometryPart={geometry.coordinates}
          minCoordsPerGroup={2}
          store={store}
          index={0}
        />
      </div>
    );
  }
}

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => props => <EditFeatureGeometryFormTypeMultiLineString {...props} />
);
