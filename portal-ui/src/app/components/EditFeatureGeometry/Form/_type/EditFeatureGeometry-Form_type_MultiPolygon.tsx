import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Coordinate } from 'ol/coordinate';

import {
  CoordinateEdited,
  GeometryType,
  WfsMultiPolygonGeometry,
  WfsPolygonGeometry
} from '../../../../services/geoserver/wfs/wfs.models';
import { getEmptyGeometry } from '../../../../services/geoserver/wfs/wfs.util';
import { EditFeatureGeometryAddButton } from '../../AddButton/EditFeatureGeometry-AddButton';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

@observer
class EditFeatureGeometryFormTypeMultiPolygon extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, store } = this.props;
    const geometry = store.geometry as WfsMultiPolygonGeometry;
    const startingIndexes = this.getCoordinatesIndexArray(geometry.coordinates);

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        {geometry.coordinates.map((geometryPart, index) => (
          <EditFeatureGeometrySuperGroup
            geometryPart={geometryPart}
            minCoordsPerGroup={4}
            groupsMustBeClosed
            store={store}
            index={index}
            startingIndexes={startingIndexes[index]}
            key={index}
            onPolygonDelete={this.handleDeletePolygon}
          />
        ))}

        <EditFeatureGeometryAddButton onClick={this.handlePolygonAdd}>Добавить полигон</EditFeatureGeometryAddButton>
      </div>
    );
  }

  // собираем стартовые индексы для каждого набора координат
  private getCoordinatesIndexArray(coordinates: Coordinate[][][]): number[][][] {
    let coordinatesCounter: number = 0;

    return coordinates.map((coord, i) => {
      return coord.map((c, y) => {
        let startingIndexOfTheCoordinateSet = coordinatesCounter;

        if (!i && !y) {
          startingIndexOfTheCoordinateSet = 0;
        }

        coordinatesCounter = coordinatesCounter + c.length - 1;

        return [startingIndexOfTheCoordinateSet];
      });
    });
  }

  @action.bound
  private handlePolygonAdd() {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    const { coordinates } = getEmptyGeometry(GeometryType.POLYGON) as WfsPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.push(coordinates);
  }

  @action.bound
  private handleDeletePolygon(i: number) {
    const geometry = this.props.store.geometry as WfsMultiPolygonGeometry<CoordinateEdited>;
    geometry.coordinates.splice(i, 1);
  }
}

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POLYGON },
  () => EditFeatureGeometryFormTypeMultiPolygon
);
