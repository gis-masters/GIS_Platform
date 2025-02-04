import { Basemap } from '../../../../src/app/services/data/basemaps/basemaps.models';
import { projectBasemapClient } from '../../../../src/app/services/gis/project-basemaps/project-basemaps.client';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { requestAsAdmin } from '../requestAs';

export async function addBasemapToProject(project: CrgProject, basemap: Basemap): Promise<void> {
  await requestAsAdmin(projectBasemapClient.connectBasemapToProject, project.id, Number(basemap.id), basemap.title);
}
