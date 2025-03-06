import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiPolygonGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometryViewSuperGroup } from '../../ViewSuperGroup/EditFeatureGeometry-ViewSuperGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypeMultiPolygon: FC<EditFeatureGeometryViewProps> = ({ className }) => {
  const geometry = editFeatureStore.geometry as WfsMultiPolygonGeometry;
  let coordinatesCounter: number = 0;

  const startingIndexes = geometry.coordinates.map((coord, i) => {
    return coord.map((c, y) => {
      let startingIndexOfTheCoordinateSet = coordinatesCounter;

      if (!i && !y) {
        startingIndexOfTheCoordinateSet = 0;
      }

      coordinatesCounter = coordinatesCounter + c.length - 1;

      return [startingIndexOfTheCoordinateSet];
    });
  });

  return (
    <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
      {(editFeatureStore.geometry as WfsMultiPolygonGeometry).coordinates.map((coordinatesGroup, i) => (
        <EditFeatureGeometryViewSuperGroup
          coordinates={coordinatesGroup}
          startingIndexes={startingIndexes[i]}
          key={i}
        />
      ))}
    </div>
  );
};

export const withTypeMultiPolygon = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_POLYGON },
  () => EditFeatureGeometryViewTypeMultiPolygon
);
