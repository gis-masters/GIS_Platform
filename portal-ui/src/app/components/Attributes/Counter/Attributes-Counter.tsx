import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { selectedFeaturesStore } from '../../../stores/SelectedFeatures.store';
import { AttributesCounterItem } from '../CounterItem/Attributes-CounterItem';

import './Attributes-Counter.scss';

const cnAttributesCounter = cn('Attributes', 'Counter');

interface AttributesCounterProps {
  featuresMatched: number;
  featuresTotal: number;
  layer: CrgVectorLayer;
}

export const AttributesCounter: FC<AttributesCounterProps> = observer(({ layer, featuresMatched, featuresTotal }) => {
  const selectedCount = selectedFeaturesStore.featuresByResourceId[layer.resourceId]?.length || 0;

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
