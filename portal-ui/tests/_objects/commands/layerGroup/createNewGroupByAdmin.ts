import { updateLayer } from '../../../../src/app/services/gis/layers.service';
import { projectsService } from '../../../../src/app/services/gis/projects/projects.service';

import { authenticateAsOwner } from '../auth/authenticate';

declare const window: {
  projectsService: typeof projectsService;
  updateLayer: typeof updateLayer;
};

export async function createNewGroupByAdmin(projectTitle: string, title: string, enabled: boolean): Promise<void> {
  await authenticateAsOwner();

  await browser.executeAsync(
    async (projectTitle, title, enabled, callback) => {
      const group = {
        enabled,
        expanded: true,
        position: -1,
        title,
        transparency: 100
      };
      const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 10 });
      const project = projects.find(project => project.name === projectTitle);

      if (project?.id) {
        await window.projectsService.createGroup(group, project?.id);
      }

      callback();
    },
    projectTitle,
    title,
    enabled
  );
}
