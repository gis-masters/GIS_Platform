import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { ValidationWsMsg, wsService } from '../../ws.service';
import { ExportResourceModel } from '../export/export.models';
import { Process } from '../processes/processes.models';
import { validationClient } from './validation.client';
import { ValidationPayload, ValidationResultsResponse, ValidationShortInfo } from './validation.models';

export async function initValidation(layers: CrgVectorLayer[]): Promise<ValidationWsMsg> {
  return validationClient.initValidation(preparePayload(layers));
}

export async function getValidationResults(
  resource: ExportResourceModel,
  page: number,
  size: number,
  sortBy: string,
  sortDirection: string
): Promise<ValidationResultsResponse> {
  return await validationClient.getValidationResults(resource, page, size, sortBy, sortDirection);
}

export async function getValidationShortInfo(layers: CrgVectorLayer[]): Promise<ValidationShortInfo[]> {
  return await validationClient.getValidationShortInfo(preparePayload(layers));
}

export async function getExportValidationReport(layers: CrgVectorLayer[]): Promise<Process> {
  return await validationClient.getExportValidationReport(preparePayload(layers));
}

function preparePayload(layers: CrgVectorLayer[]): ValidationPayload {
  return {
    wsUiId: wsService.getId(),
    resources: layers.map(layer => ({
      dataset: layer.dataset,
      table: layer.tableName
    }))
  };
}
