import { Given } from '@wdio/cucumber-framework';

import { getDatasets, getDatasetTables } from '../../../src/app/services/data/data.service';
import { createLayer } from '../../../src/app/services/gis/layers.service';
import { currentUser } from '../../../src/app/stores/CurrentUser.store';
import { projectsService } from '../../../src/app/services/gis/projects.service';
import { authenticateAsOwner } from './auth/authenticate';
import { CrgLayerType } from '../../../src/app/services/gis/projects.models';

declare const window: {
  getDatasetTables: typeof getDatasetTables;
  projectsService: typeof projectsService;
  getDatasets: typeof getDatasets;
  createLayer: typeof createLayer;
  currentUser: typeof currentUser;
};

export async function createLayerWIthView(layerTitle: string, viewId: string): Promise<void> {
  await authenticateAsOwner();

  await browser.executeAsync(
    async (title, id, callback) => {
      const [datasets] = await window.getDatasets({ page: 0, pageSize: 10 });
      const [vectorTables] = await window.getDatasetTables(datasets[0].identifier, { page: 0, pageSize: 10 });
      const vectorTable = vectorTables.find(item => item.title === title);
      const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });

      if (!vectorTable) {
        return;
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
        styleName: vectorTable.schemaId,
        view: id,
        enabled: true,
        position: -42,
        transparency: 75,
        minZoom: 10,
        maxZoom: 26
      };

      await window.createLayer(layer, projects[0].id);

      callback();
    },
    layerTitle,
    viewId
  );
}

Given(/^создан слой "(.*)" с id представления "(.*)"$/, async (layerTitle: string, viewId: string) => {
  await createLayerWIthView(layerTitle, viewId);
});
