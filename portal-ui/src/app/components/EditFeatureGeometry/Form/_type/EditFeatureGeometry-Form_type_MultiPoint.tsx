import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { withBemMod } from '@bem-react/core';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsMultiPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { isArrayOf } from '../../../../services/util/typeGuards/isArrayOf';
import { isCoordinate } from '../../../../services/util/typeGuards/isCoordinate';
import { editFeatureStore } from '../../../../stores/EditFeatureStore';
import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group.composed';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

class EditFeatureGeometryFormTypeMultiPoint extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsMultiPointGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryDraw onDraw={this.handleDraw} />
        </EditFeatureGeometryToolbar>

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

  @action.bound
  private handleDraw(coords: Coordinate[]) {
    const coordinates = editFeatureStore.geometry?.coordinates;
    if (isArrayOf(coordinates, isCoordinate)) {
      coordinates.push(...coords);
    }
  }
}

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryFormTypeMultiPoint
);
