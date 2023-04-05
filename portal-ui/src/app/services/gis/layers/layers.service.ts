import { AxiosError } from 'axios';

import { currentProject } from '../../../stores/CurrentProject.store';
import { services } from '../../services';
import { CrgProject } from '../projects/projects.models';
import { Toast } from '../../../components/Toast/Toast';

import { CrgLayer, CrgLayersGroup, CrgRasterLayer, NewCrgLayer } from './layers.models';
import { _reqCreateLayer, _reqDeleteLayer, _reqUpdateLayer } from './layers.client';

export async function deleteLayer(layerId: number, project: CrgProject = currentProject): Promise<void> {
  await _reqDeleteLayer(layerId, project.id);
}

export async function createLayer(newLayer: NewCrgLayer, projectId: number): Promise<CrgLayer> {
  return await _reqCreateLayer(newLayer, projectId);
}

export async function createRasterLayer(layer: CrgRasterLayer, projectId: number): Promise<CrgLayer> {
  return await _reqCreateLayer(layer, projectId);
}

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  await _reqUpdateLayer(layerId, patch, project.id);
}

export function alertLayerOperationError(
  e: AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
  payload: Record<string, unknown> | CrgLayersGroup,
  actionText: string,
  actionName: string
): void {
  const payloadDetails = JSON.stringify(payload, null, 2);
  let responseDetails = '-';
  if (e.response) {
    const responseData = JSON.stringify(
      {
        ...e.response,
        request: undefined,
        config: undefined,
        headers: undefined
      },
      null,
      2
    );
    responseDetails = `${e.response.config?.url} \n${responseData}`;
  }

  const message = `Не удалось ${actionText} "${actionName}"`;

  const details = e.response?.data?.message || `Запрос: \n${responseDetails} \n\nДанные: \n${payloadDetails}`;

  Toast.error({ message, details });
  services.logger.error(message, e);
}

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { updateLayer });
}
