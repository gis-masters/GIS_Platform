import { updateLayer } from '../../../../src/app/services/gis/layers.service';
import { projectsService } from '../../../../src/app/services/gis/projects.service';

import { authenticateAsOwner } from '../auth/authenticate';

declare const window: {
  projectsService: typeof projectsService;
  updateLayer: typeof updateLayer;
};

export async function addLayerToGroupByAdmin(
  projectTitle: string,
  groupTitle: string,
  layerTitle: string
): Promise<void> {
  await authenticateAsOwner();

  await browser.executeAsync(
    async (projectTitle, groupTitle, layerTitle, callback) => {
      const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });
      const project = projects.find(project => project.name === projectTitle);

      if (project) {
        const groups = await window.projectsService.getGroups(project.id);
        const layers = await window.projectsService.getLayers(project.id);

        const layer = layers.find(layer => layer.title === layerTitle);
        const group = groups.find(group => group.title === groupTitle);

        if (group?.id && layer?.id) {
          await window.updateLayer(layer.id, { parentId: group.id }, project);
        }
      }

      callback();
    },
    projectTitle,
    groupTitle,
    layerTitle
  );
}
