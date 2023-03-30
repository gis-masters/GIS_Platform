import { DataTable, Given } from '@wdio/cucumber-framework';

import { authenticateAsAdmin } from '../auth/authenticate';
import { createNewObjectInLayerAsAdmin } from './createNewObjectInLayerAsAdmin';
import { CrgLayerType } from '../../../../src/app/services/gis/projects/projects.models';
import { createLayerByAdmin } from './createLayerByAdmin';
import { testSchemas } from '../schemas/testSchemas';
import { ScenarioScope } from '../../ScenarioScope';
import { getCrgLayer } from './getCrgLayer';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';
import { getProjectsByTitle } from '../projects/getProjectsByTitle';

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

Given('администратором создан слой с параметрами:', async function (this: ScenarioScope, table: DataTable) {
  const [projectTitle, layerTitle, tableTitle, datasetTitle, enabled, viewId] = table.rows()[0];

  const { latestDataset, latestProject } = this;
  let latestDatasetId = latestDataset.identifier;
  if (latestDataset.title !== datasetTitle) {
    const datasets = await getDatasetByTitle(datasetTitle);

    if (datasets.length !== 1) {
      throw new Error(`Ошибка получения набора данных ${datasetTitle}`);
    }

    latestDatasetId = datasets[0].identifier;
  }

  let projectId = latestProject.id;
  if (latestProject.name !== projectTitle) {
    const projects = await getProjectsByTitle(projectTitle);

    if (projects.length !== 1) {
      throw new Error(`Ошибка получения проекта ${projectTitle}`);
    }

    projectId = projects[0].id;
  }

  const layer = await getCrgLayer(layerTitle, tableTitle, latestDatasetId, enabled, viewId);

  await createLayerByAdmin(projectId, layer);
});
