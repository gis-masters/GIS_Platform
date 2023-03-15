import { Given } from '@wdio/cucumber-framework';

import { getDatasets, getDatasetTables } from '../../../src/app/services/data/data.service';
import { createLayer } from '../../../src/app/services/gis/layers.service';
import { currentUser } from '../../../src/app/stores/CurrentUser.store';
import { projectsService } from '../../../src/app/services/gis/projects.service';
import { authenticateAsOwner } from './auth/authenticate';
import { schemaService } from '../../../src/app/services/data/schema.service';
import { CrgLayer, CrgLayerType } from '../../../src/app/services/gis/projects.models';

declare const window: {
  getDatasetTables: typeof getDatasetTables;
  projectsService: typeof projectsService;
  getDatasets: typeof getDatasets;
  createLayer: typeof createLayer;
  schemaService: typeof schemaService;
  currentUser: typeof currentUser;
};

export async function createNewLayerByAdmin(layerTitle: string, enabled = true, viewId?: string): Promise<void> {
  await authenticateAsOwner();

  await browser.executeAsync(
    async (title, enabled, id, callback) => {
      const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });
      const [vectorTables] = await window.getDatasetTables(datasets[0].identifier, { page: 0, pageSize: 10 });
      const vectorTable = vectorTables.find(item => item.title === title);
      if (!vectorTable) {
        throw new Error('Нет векторной таблицы');
      }
      const schema = await window.schemaService.getSchema(vectorTable.schemaId);
      const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });

      if (!schema) {
        throw new Error('Нет схемы');
      }

      const layer = {
        dataStoreName: window.currentUser.workspaceName,
        type: 'vector' as CrgLayerType,
        dataset: datasets[0].identifier,
        tableName: vectorTable.identifier,
        complexName: `${window.currentUser.workspaceName}:${vectorTable.identifier}`,
        title: title,
        nativeCRS: vectorTable.crs,
        schemaId: vectorTable.schemaId,
        styleName: schema.styleName,
        view: id,
        enabled,
        position: -42,
        transparency: 75,
        minZoom: 3,
        maxZoom: 25
      };

      await window.createLayer(layer, projects[0].id);

      callback();
    },
    layerTitle,
    enabled,
    viewId
  );
}

export async function createVectorLayer(projectId: number, layer: CrgLayer): Promise<CrgLayer> {
  return await browser.executeAsync(
    async (projectId, serializedLayer, callback) => {
      const layer = JSON.parse(serializedLayer) as CrgLayer;

      const newLayer = await window.createLayer(layer, projectId);

      callback(newLayer);
    },
    projectId,
    JSON.stringify(layer)
  );
}

Given(/^слой "(.*)" с id представления "(.*)" создан администратором$/, async (layerTitle: string, viewId: string) => {
  await createNewLayerByAdmin(layerTitle, true, viewId);
});

Given(/^слой с названием "(.*)" создан администратором$/, async (layerTitle: string) => {
  await createNewLayerByAdmin(layerTitle);
});

Given(/^выключенный слой с названием "(.*)" создан администратором$/, async (layerTitle: string) => {
  await createNewLayerByAdmin(layerTitle, false);
});
