import { updateLayer } from '../../../../src/app/services/gis/layers.service';
import { CrgLayersGroup } from '../../../../src/app/services/gis/projects/projects.models';
import { projectsService } from '../../../../src/app/services/gis/projects/projects.service';

import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  projectsService: typeof projectsService;
  updateLayer: typeof updateLayer;
};

export async function createGroupByAdmin(group: CrgLayersGroup, projectId: number): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(
    async (group, projectId, callback) => {
      await window.projectsService.createGroup(group, projectId);

      callback();
    },
    group,
    projectId
  );
}
