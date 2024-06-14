import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { withBemMod } from '@bem-react/core';
import { Coordinate } from 'ol/coordinate';

import {
  CoordinateEdited,
  GeometryType,
  isCoordinateEdited,
  WfsMultiPointGeometry
} from '../../../../services/geoserver/wfs/wfs.models';
import { isArrayOf } from '../../../../services/util/typeGuards/isArrayOf';
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
    const { store, className } = this.props;
    const geometry = store.geometry as WfsMultiPointGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryDraw store={store} onDraw={this.handleDraw} />
        </EditFeatureGeometryToolbar>

        <EditFeatureGeometryGroup
          coordinates={geometry.coordinates}
          canBeDeleted={false}
          minCoordsCount={1}
          multiple={false}
          store={store}
          index={0}
        />
      </div>
    );
  }

  @action.bound
  private handleDraw(coords: Coordinate[]) {
    const coordinates = this.props.store.geometry?.coordinates;
    if (isArrayOf(coordinates, isCoordinateEdited)) {
      // TODO: убрать as после перехода на strict mode
      (coordinates as CoordinateEdited[]).push(...coords);
    }
  }
}

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryFormTypeMultiPoint
);
