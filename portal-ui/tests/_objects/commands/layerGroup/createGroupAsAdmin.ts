import { CrgLayersGroup } from '../../../../src/app/services/gis/layers/layers.models';
import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';
import { requestAsAdmin } from '../requestAs';

export async function createGroupAsAdmin(group: Omit<CrgLayersGroup, 'id'>, projectId: number): Promise<void> {
  const groupDefaults = { position: -1, transparency: 100 };
  await requestAsAdmin(projectsClient.createGroup, { ...groupDefaults, ...group }, projectId);
}
