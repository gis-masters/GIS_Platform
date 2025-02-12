import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { withBemMod } from '@bem-react/core';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { isArrayOf } from '../../../../services/util/typeGuards/isArrayOf';
import { isCoordinate } from '../../../../services/util/typeGuards/isCoordinate';
import { editFeatureStore } from '../../../../stores/EditFeatureStore';
import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group.composed';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

class EditFeatureGeometryFormTypeLineString extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsLineStringGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryDraw onDraw={this.handleDraw} />
        </EditFeatureGeometryToolbar>

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

  @action.bound
  private handleDraw(coords: Coordinate[]) {
    const coordinates = editFeatureStore.geometry?.coordinates;
    if (isArrayOf(coordinates, isCoordinate)) {
      coordinates.splice(0, coordinates.length, ...coords);
    }
  }
}

export const withTypeLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.LINE_STRING },
  () => EditFeatureGeometryFormTypeLineString
);
