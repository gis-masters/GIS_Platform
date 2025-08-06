import React, { Component } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group.composed';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

class EditFeatureGeometryFormTypeLineString extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
  }

  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsLineStringGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryGroup
          coordinates={geometry.coordinates}
          canBeDeleted={false}
          minCoordsCount={2}
          multiple={false}
          index={0}
        />
      </div>
    );
  }
}

export const withTypeLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.LINE_STRING },
  () => EditFeatureGeometryFormTypeLineString
);
