import { DataTable, Given } from '@wdio/cucumber-framework';

import { getSchema } from '../schemas/getSchema';
import { CrgLayerType } from '../../../../src/app/services/gis/layers/layers.models';
import { createLayerAsAdmin } from './createLayerAsAdmin';
import { getTestSchemaByName } from '../schemas/testSchemas';
import { ScenarioScope } from '../../ScenarioScope';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';
import { getProjectByTitle } from '../projects/getProjectByTitle';
import { getVectorTableByTitle } from '../tables/getVectorTableByTitle';

Given(
  'в созданном проекте создан слой {string} на основе созданных набора данных и таблицы',
  async function (this: ScenarioScope, layerTitle: string) {
    const { latestProject, latestVectorTable, latestDataset } = this;

    const schema = getTestSchemaByName(latestVectorTable.schemaId);

    const layer = {
      type: 'vector' as CrgLayerType.VECTOR,
      title: layerTitle,
      dataset: latestDataset.identifier,
      view: 'viewId',
      tableName: latestVectorTable.identifier,
      nativeCRS: latestVectorTable.crs,
      schemaId: latestVectorTable.schemaId,
      styleName: schema.styleName,
      enabled: true
    };

    this.latestLayer = await createLayerAsAdmin(latestProject.id, layer);
  }
);

Given('в созданном проекте существует внешний слой', async function (this: ScenarioScope, table: DataTable) {
  const { latestProject } = this;

  const data = table.raw()[1];

  const externalLayer = {
    title: data[0],
    tableName: data[1],
    type: CrgLayerType.EXTERNAL,
    dataSourceUri: data[2],
    enabled: Boolean(data[3])
  };

  this.latestLayer = await createLayerAsAdmin(latestProject.id, externalLayer);
});

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

  await createLayerAsAdmin(project.id, layer);
});
