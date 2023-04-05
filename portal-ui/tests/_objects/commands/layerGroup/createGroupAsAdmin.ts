import { CrgLayersGroup } from '../../../../src/app/services/gis/layers/layers.models';
import { _reqCreateGroup } from '../../../../src/app/services/gis/projects/projects.client';
import { requestAsAdmin } from '../requestAs';

export async function createGroupAsAdmin(group: CrgLayersGroup, projectId: number): Promise<void> {
  const groupDefaults = { position: -1, transparency: 100 };
  await requestAsAdmin(_reqCreateGroup, { ...groupDefaults, ...group }, projectId);
}
