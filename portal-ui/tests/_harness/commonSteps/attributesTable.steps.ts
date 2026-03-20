import { Given } from '@wdio/cucumber-framework';

import { type CrgVectorLayer } from '../../../src/app/services/gis/layers/layers.models';
import { disabledFilterForLayer } from '../commands/attributesTable/disabledFilterForLayer';
import { type ScenarioScope } from '../ScenarioScope';

Given('отключен фильтр в атрибутивной таблице созданного слоя', async function (this: ScenarioScope) {
  const { latestLayer } = this;

  await disabledFilterForLayer(latestLayer as CrgVectorLayer);
});
