import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { AttributesCounterItem } from '../CounterItem/Attributes-CounterItem';

import '!style-loader!css-loader!sass-loader!./Attributes-Counter.scss';

const cnAttributesCounter = cn('Attributes', 'Counter');

interface AttributesCounterProps {
  featuresMatched: number;
  featuresTotal: number;
  layer: CrgVectorLayer;
}

export const AttributesCounter: FC<AttributesCounterProps> = observer(({ layer, featuresMatched, featuresTotal }) => {
  const selectedCount = selectedFeaturesStore.featuresByTableName[layer.tableName]?.length || 0;

  return (
    <div className={cnAttributesCounter()}>
      {selectedFeaturesStore.limitReached && (
        <AttributesCounterItem color='error'>
          Достигнут максимум выбираемых объектов: {selectedFeaturesStore.limit}
        </AttributesCounterItem>
      )}
      {!!selectedCount && <AttributesCounterItem>выделено: {selectedCount}</AttributesCounterItem>}
      {featuresMatched !== featuresTotal && <AttributesCounterItem>найдено: {featuresMatched}</AttributesCounterItem>}
      {!!featuresTotal && <AttributesCounterItem>всего: {featuresTotal}</AttributesCounterItem>}
    </div>
  );
});
