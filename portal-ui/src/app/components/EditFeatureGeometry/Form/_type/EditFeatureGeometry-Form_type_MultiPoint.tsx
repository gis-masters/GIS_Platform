import React, { Component } from 'react';
import { withBemMod } from '@bem-react/core';
import { action, makeObservable } from 'mobx';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsMultiPointGeometry } from '../../../../services/geoserver/wfs/wfs.models';

import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group';
import { EditFeatureGeometryFormProps, cnEditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';

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
    (this.props.store.geometry.coordinates as Coordinate[]).push(...coords);
  }
}

export const withTypeMultiPoint = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POINT },
  () => EditFeatureGeometryFormTypeMultiPoint
);
