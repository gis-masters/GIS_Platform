import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { EditFeatureGeometryViewGroup } from '../../ViewGroup/EditFeatureGeometry-ViewGroup';
import { cnEditFeatureGeometryView, EditFeatureGeometryViewProps } from '../EditFeatureGeometry-View';

const EditFeatureGeometryViewTypeMultiLineString: FC<EditFeatureGeometryViewProps> = ({ store, className }) => {
  const geometry = store.geometry as WfsMultiLineStringGeometry;

  let coordinatesCounter: number = 0;

  // собираем стартовые индексы для каждого набора координат
  const startingIndexes = geometry.coordinates.map((coord, i) => {
    const startingIndexOfTheCoordinateSet = coordinatesCounter;
    coordinatesCounter = coordinatesCounter + coord.length;

    return [i ? startingIndexOfTheCoordinateSet : 0];
  });

  return (
    <div className={cnEditFeatureGeometryView(null, [className, 'scroll'])}>
      {(store.geometry as WfsMultiLineStringGeometry).coordinates.map((coordinatesGroup, i) => (
        <EditFeatureGeometryViewGroup
          coordinates={coordinatesGroup}
          key={i}
          index={i}
          startIndex={startingIndexes[i][0]}
          store={store}
        />
      ))}
    </div>
  );
};

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryViewProps>(
  cnEditFeatureGeometryView(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => EditFeatureGeometryViewTypeMultiLineString
);
