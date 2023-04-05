import { DataTable, Given } from '@wdio/cucumber-framework';

import { authenticateAsAdmin } from '../auth/authenticate';
import { createNewObjectInLayerAsAdmin } from './createNewObjectInLayerAsAdmin';
import { CrgLayerType } from '../../../../src/app/services/gis/layers/layers.models';
import { createLayerAsAdmin } from './createLayerByAdmin';
import { testSchemas } from '../schemas/testSchemas';
import { ScenarioScope } from '../../ScenarioScope';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';
import { getProjectByTitle } from '../projects/getProjectByTitle';
import { getVectorTableByTitle } from '../tables/getVectorTableByTitle';
import { getSchema } from '../schemas/getSchema';

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

    this.latestLayer = await createLayerAsAdmin(layer, latestProject.id);
  }
);

Given(
  'администратором создан объект по таблице {string} набора данных {string}',
  async (tableTitle: string, datasetTitle: string) => {
    await createNewObjectInLayerAsAdmin(tableTitle, datasetTitle);
  }
);

Given('администратором создан слой с параметрами:', async function (table: DataTable) {
  const [projectTitle, layerTitle, tableTitle, datasetTitle, enabled, viewId] = table.rows()[0];
  const dataset = await getDatasetByTitle(datasetTitle);
  const project = await getProjectByTitle(projectTitle);
  const vectorTable = await getVectorTableByTitle(dataset.identifier, tableTitle);
  const schema = await getSchema(vectorTable.schemaId);

  const layer = {
    type: 'vector' as CrgLayerType,
    dataset: dataset.identifier,
    tableName: vectorTable.identifier,
    title: layerTitle,
    nativeCRS: vectorTable.crs,
    schemaId: vectorTable.schemaId,
    styleName: schema.styleName,
    enabled: enabled === 'включенный',
    ...(viewId ? { view: viewId } : {})
  };

  await createLayerAsAdmin(layer, project.id);
});
