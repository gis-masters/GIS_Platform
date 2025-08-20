import React, { Component } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group.composed';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

class EditFeatureGeometryFormTypeMultiPoint extends Component<EditFeatureGeometryFormProps> {
  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsMultiPointGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryGroup
          coordinates={geometry.coordinates}
          canBeDeleted={false}
          minCoordsCount={1}
          multiple={false}
          index={0}
        />
      </div>
    );
  }
}

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryFormTypeMultiPoint
);
