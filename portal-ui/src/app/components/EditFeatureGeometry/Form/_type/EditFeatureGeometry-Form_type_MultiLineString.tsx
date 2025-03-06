import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { GeometryType, WfsMultiLineStringGeometry } from '../../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometrySuperGroup } from '../../SuperGroup/EditFeatureGeometry-SuperGroup';
import { cnEditFeatureGeometryForm, EditFeatureGeometryFormProps } from '../EditFeatureGeometry-Form.base';

const EditFeatureGeometryFormTypeMultiLineString: FC<EditFeatureGeometryFormProps> = observer(({ className }) => {
  const geometry = editFeatureStore.geometry as WfsMultiLineStringGeometry;

  let coordinatesCounter: number = 0;

  // собираем стартовые индексы для каждого набора координат
  const startingIndexes = geometry.coordinates.map((coord, i) => {
    const startingIndexOfTheCoordinateSet = coordinatesCounter;
    coordinatesCounter = coordinatesCounter + coord.length;

    return [i ? startingIndexOfTheCoordinateSet : 0];
  });

  return (
    <div className={cnEditFeatureGeometryForm(null, [className, 'scroll'])}>
      <EditFeatureGeometrySuperGroup
        geometryPart={geometry.coordinates}
        minCoordsPerGroup={2}
        startingIndexes={startingIndexes}
        index={0}
      />
    </div>
  );
});

export const withTypeMultiLineString = withBemMod<EditFeatureGeometryFormProps>(
  cnEditFeatureGeometryForm(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => EditFeatureGeometryFormTypeMultiLineString
);
