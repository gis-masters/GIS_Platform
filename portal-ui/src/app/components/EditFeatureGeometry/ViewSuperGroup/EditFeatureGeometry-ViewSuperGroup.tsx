import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { isNumber } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { EditFeatureGeometryViewGroup } from '../ViewGroup/EditFeatureGeometry-ViewGroup';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewSuperGroup.scss';

const cnEditFeatureGeometryViewSuperGroup = cn('EditFeatureGeometry', 'ViewSuperGroup');

interface EditFeatureGeometryViewSuperGroupProps {
  coordinates: Coordinate[][];
  store: EditFeatureGeometryStore;
  startingIndexes?: number[][];
}

export const EditFeatureGeometryViewSuperGroup: FC<EditFeatureGeometryViewSuperGroupProps> = ({
  coordinates,
  store,
  startingIndexes
}) => (
  <div className={cnEditFeatureGeometryViewSuperGroup()}>
    {coordinates.map((coordinatesGroup, i) => {
      let startIndex: number | undefined;

      if (startingIndexes && isNumber(startingIndexes[i][0])) {
        startIndex = startingIndexes[i][0];
      }

      return (
        <EditFeatureGeometryViewGroup
          coordinates={coordinatesGroup}
          startIndex={startIndex}
          key={i}
          store={store}
          index={0}
        />
      );
    })}
  </div>
);
