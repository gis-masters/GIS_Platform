import { ValidationWsMsg, wsService } from '../../ws.service';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { ExportResourceModel } from '../export/export.models';
import { Process } from '../processes/processes.models';

import { ValidationShortInfo, ValidationResultsResponse, ValidationPayload } from './validation.models';
import {
  _reqGetExportValidationReport,
  _reqGetValidationResults,
  _reqGetValidationShortInfo,
  _reqInitValidation
} from './validation.client';

export async function initValidation(layers: CrgVectorLayer[]): Promise<ValidationWsMsg> {
  return _reqInitValidation(preparePayload(layers));
}

export async function getValidationResults(
  resource: ExportResourceModel,
  page: number,
  size: number,
  sortBy: string,
  sortDirection: string
): Promise<ValidationResultsResponse> {
  return await _reqGetValidationResults(resource, page, size, sortBy, sortDirection);
}

export async function getValidationShortInfo(layers: CrgVectorLayer[]): Promise<ValidationShortInfo[]> {
  return await _reqGetValidationShortInfo(preparePayload(layers));
}

export async function getExportValidationReport(layers: CrgVectorLayer[]): Promise<Process> {
  return await _reqGetExportValidationReport(preparePayload(layers));
}

function preparePayload(layers: CrgVectorLayer[]): ValidationPayload {
  return {
    wsUiId: wsService.getId(),
    resources: layers.map((layer: CrgVectorLayer) => {
      return {
        dataset: layer.dataset,
        table: layer.tableName,
        schemaId: layer.schemaId
      };
    })
  };
}
