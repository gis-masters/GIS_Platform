import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { type Coordinate } from 'ol/coordinate';

import { GeometryType, type WfsMultiPolygonGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureHistoryStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureHistoryStore';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../../services/map/draw/map-draw.service';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { cnEditFeatureGeometryForm, type EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

@observer
class EditFeatureGeometryFormTypeMultiPolygon extends Component<EditFeatureGeometryFormProps> {
  constructor(props: EditFeatureGeometryFormProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;
    const geometry = editFeatureStore.geometry as WfsMultiPolygonGeometry;
    const startingIndexes = this.getCoordinatesIndexArray(geometry.coordinates);

    return (
      <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
        {geometry.coordinates.map((geometryPart, index) => (
          <EditFeatureGeometrySuperGroup
            geometryPart={geometryPart}
            minCoordsPerGroup={4}
            groupsMustBeClosed
            index={index}
            startingIndexes={startingIndexes[index]}
            key={index}
            onPolygonDelete={this.handleDeletePolygon}
          />
        ))}
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
  private async handleDeletePolygon(i: number) {
    const geometry = editFeatureStore.geometry as WfsMultiPolygonGeometry;
    geometry.coordinates.splice(i, 1);

    // Добавляем в историю как единый шаг
    if (editFeatureStore.geometry) {
      editFeatureHistoryStore.add(editFeatureStore.geometry, 'Удаление полигона');
    }

    await mapDrawService.syncFeatureGeometryWithMap();
  }
}

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_POLYGON },
  () => EditFeatureGeometryFormTypeMultiPolygon
);
