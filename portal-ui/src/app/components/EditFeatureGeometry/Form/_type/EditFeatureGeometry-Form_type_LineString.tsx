import React, { Component } from 'react';
import { withBemMod } from '@bem-react/core';
import { action, makeObservable } from 'mobx';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsLineStringGeometry } from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryDraw } from '../../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryGroup } from '../../Group/EditFeatureGeometry-Group';
import { EditFeatureGeometryToolbar } from '../../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryFormProps, cnEditFeatureGeometryForm } from '../EditFeatureGeometry-Form';

class EditFeatureGeometryFormTypeLineString extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { store, className } = this.props;
    const geometry = store.geometry as WfsLineStringGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryDraw store={store} onDraw={this.handleDraw} />
        </EditFeatureGeometryToolbar>

        <EditFeatureGeometryGroup
          coordinates={geometry.coordinates}
          canBeDeleted={false}
          minCoordsCount={2}
          multiple={false}
          store={store}
          index={0}
        />
      </div>
    );
  }

  @action.bound
  private handleDraw(coords: Coordinate[]) {
    const coordinates = this.props.store.geometry.coordinates as Coordinate[];
    coordinates.splice(0, coordinates.length, ...coords);
  }
}

export const withTypeLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.LINE_STRING },
  () => EditFeatureGeometryFormTypeLineString
);
