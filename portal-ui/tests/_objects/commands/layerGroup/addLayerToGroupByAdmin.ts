import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';
import { layersClient } from '../../../../src/app/services/gis/layers/layers.client';
import { getProjectByTitle } from '../projects/getProjectByTitle';
import { requestAsAdmin } from '../requestAs';

export async function addLayerToGroupAsAdmin(
  projectTitle: string,
  groupTitle: string,
  layerTitle: string
): Promise<void> {
  const project = await getProjectByTitle(projectTitle);
  const groups = await requestAsAdmin(projectsClient.getProjectGroups.bind(projectsClient), project.id);
  const layers = await requestAsAdmin(projectsClient.getProjectLayers.bind(projectsClient), project.id);
  const layer = layers.find(layer => layer.title === layerTitle);
  const group = groups.find(group => group.title === groupTitle);

  if (!layer?.id || !group) {
    throw new Error(`Ошибка добавления слоя "${layerTitle}" в группу ${groupTitle} в проекте "${project.name}"`);
  }

  await requestAsAdmin(layersClient.updateLayer.bind(layersClient), layer.id, { parentId: group.id }, project.id);
}
