import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import {
  WfsMultiPolygonGeometry,
  CoordinateEdited,
  GeometryType,
  WfsPolygonGeometry
} from '../../../../services/geoserver/wfs.models';

import { EditFeatureGeometryFormProps, cnEditFeatureGeometryForm } from '../EditFeatureGeometry-Form';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { EditFeatureGeometryAddButton } from '../../AddButton/EditFeatureGeometry-AddButton';
import { getEmptyGeometry } from '../../../../services/geoserver/wfs.util';

@observer
class EditFeatureGeometryFormTypeMultiPolygon extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsMultiPolygonGeometry;

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        {geometry.coordinates.map((geometryPart, index) => (
          <EditFeatureGeometrySuperGroup
            geometryPart={geometryPart}
            minCoordsPerGroup={4}
            groupsMustBeClosed
            store={store}
            index={index}
            key={index}
            onPolygonDelete={this.deletePolygonHandler}
          />
        ))}

        <EditFeatureGeometryAddButton onClick={this.addPolygonHandler}>Добавить полигон</EditFeatureGeometryAddButton>
      </div>
    );
  }

  @action.bound
  private addPolygonHandler() {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    const { coordinates } = getEmptyGeometry(GeometryType.POLYGON) as WfsPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.push(coordinates);
  }

  @action.bound
  private deletePolygonHandler(i: number) {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.splice(i, 1);
  }
}

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POLYGON },
  () => EditFeatureGeometryFormTypeMultiPolygon
);
