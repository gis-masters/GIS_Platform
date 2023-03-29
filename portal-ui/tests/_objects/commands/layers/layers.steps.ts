import { Given } from '@wdio/cucumber-framework';

import { authenticateAsAdmin } from '../auth/authenticate';
import { createNewObjectInLayerAsAdmin } from './createNewObjectInLayerAsAdmin';
import { CrgLayerType } from '../../../../src/app/services/gis/projects/projects.models';
import { createLayerByAdmin } from './createLayerByAdmin';
import { testSchemas } from '../schemas/testSchemas';
import { ScenarioScope } from '../../ScenarioScope';
import { getCrgLayer } from './getCrgLayer';

Given(
  'в созданном проекте создан слой {string} на основе созданных набора данных и таблицы',
  async function (this: ScenarioScope, layerTitle: string) {
    await authenticateAsAdmin();

    const { latestProject, latestVectorTable, latestDatasetId } = this;

    const schema = Object.values(testSchemas).find(schema => schema.name === latestVectorTable.schemaId);
    if (!schema) {
      throw new Error('Not found schema:' + latestVectorTable.schemaId);
    }

    const layer = {
      type: 'vector' as CrgLayerType.VECTOR,
      title: layerTitle,
      dataset: latestDatasetId,
      view: 'viewId',
      tableName: latestVectorTable.identifier,
      nativeCRS: latestVectorTable.crs,
      schemaId: latestVectorTable.schemaId,
      styleName: schema.styleName
    };

    this.latestLayer = await createLayerByAdmin(latestProject.id, layer);
  }
);

Given(
  /^администратором создан объект по таблице "(.*)" набора данных "(.*)"$/,
  async (tableTitle: string, datasetTitle: string) => {
    await createNewObjectInLayerAsAdmin(tableTitle, datasetTitle);
  }
);

Given(
  /^в созданном проекте администратором создан включенный слой с названием "(.*)" по таблице "(.*)" созданного набора данных с id представления "(.*)"$/,
  async function (this: ScenarioScope, layerTitle: string, tableTitle: string, viewId: string) {
    const { latestProject, latestDatasetId } = this;

    const layer = await getCrgLayer(layerTitle, tableTitle, latestDatasetId, true, viewId);

    await createLayerByAdmin(latestProject.id, layer);
  }
);

Given(
  /^в созданном проекте администратором создан слой с названием "(.*)" по таблице "(.*)" созданного набора данных$/,
  async function (this: ScenarioScope, layerTitle: string, tableTitle: string) {
    const { latestProject, latestDatasetId } = this;

    const layer = await getCrgLayer(layerTitle, tableTitle, latestDatasetId, true);

    await createLayerByAdmin(latestProject.id, layer);
  }
);

Given(
  /^в созданном проекте администратором создан выключенный слой с названием "(.*)" по таблице "(.*)" созданного набора данных$/,
  async function (this: ScenarioScope, layerTitle: string, tableTitle: string) {
    const { latestProject, latestDatasetId } = this;

    const layer = await getCrgLayer(layerTitle, tableTitle, latestDatasetId, false);

    await createLayerByAdmin(latestProject.id, layer);
  }
);
