import { Given } from '@wdio/cucumber-framework';

import { createVectorLayer } from '../createLayer';
import { ScenarioScope } from '../../ScenarioScope';
import { authenticateAsAdmin } from '../auth/authenticate';
import { CrgLayerType } from '../../../../src/app/services/gis/projects/projects.models';
import { testSchemas } from '../schemas/testSchemas';

Given(
  'в созданном проекте создан слой на основе созданного набора данных и таблицы',
  async function (this: ScenarioScope) {
    await authenticateAsAdmin();

    const { latestProject, latestVectorTable, latestDatasetId } = this;

    const schema = Object.values(testSchemas).find(schema => schema.name === latestVectorTable.schemaId);
    if (!schema) {
      throw new Error('Not found schema:' + latestVectorTable.schemaId);
    }

    const layer = {
      type: 'vector' as CrgLayerType.VECTOR,
      title: 'layerTitle',
      dataset: latestDatasetId,
      view: 'viewId',
      tableName: latestVectorTable.identifier,
      nativeCRS: latestVectorTable.crs,
      schemaId: latestVectorTable.schemaId,
      styleName: schema.styleName
    };

    this.latestLayer = await createVectorLayer(latestProject.id, layer);
  }
);
