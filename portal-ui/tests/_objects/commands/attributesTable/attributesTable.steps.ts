import { Given } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { disabledFilterForLayer } from './disabledFilterForLayer';
import { CrgVectorLayer } from '../../../../src/app/services/gis/layers/layers.models';

Given('отключен фильтр в атрибутивной таблице созданного слоя', async function (this: ScenarioScope) {
  const { latestLayer } = this;

  await disabledFilterForLayer(latestLayer as CrgVectorLayer);
});
