import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { isNumber } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { EditFeatureGeometryViewGroup } from '../ViewGroup/EditFeatureGeometry-ViewGroup';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ViewSuperGroup.scss';

const cnEditFeatureGeometryViewSuperGroup = cn('EditFeatureGeometry', 'ViewSuperGroup');

interface EditFeatureGeometryViewSuperGroupProps {
  coordinates: Coordinate[][];
  startingIndexes?: number[][];
}

export const EditFeatureGeometryViewSuperGroup: FC<EditFeatureGeometryViewSuperGroupProps> = ({
  coordinates,
  startingIndexes
}) => (
  <div className={cnEditFeatureGeometryViewSuperGroup()}>
    {coordinates.map((coordinatesGroup, i) => {
      let startIndex: number | undefined;

      if (startingIndexes && isNumber(startingIndexes[i][0])) {
        startIndex = startingIndexes[i][0];
      }

      return <EditFeatureGeometryViewGroup coordinates={coordinatesGroup} startIndex={startIndex} key={i} index={0} />;
    })}
  </div>
);
