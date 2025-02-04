import { ValidationError } from '../../util/FeaturePropertyValidators';
import { ExportResourceModel } from '../export/export.models';
import { ProcessStatus } from '../processes/processes.models';

export interface ValidationResultsResponse {
  validated: boolean;
  total: number;
  lastValidated: string;
  results: BugObject[];
  status: ProcessStatus;
}

export interface ValidationShortInfo {
  featureName: string;
  validated: boolean;
  totalViolations: number;
  lastValidationDateTime: string;
  status: string;
}

export interface BugObject {
  title?: string;
  classId: string;
  objectId: string;
  xMin: string;
  propertyViolations: ViolationItem[];
  objectViolations: ValidationError[];
}

export interface ViolationItem {
  name: string;
  value: string;
  errorTypes: string[];
}

export interface ValidationPayload {
  wsUiId: string;
  resources: ExportResourceModel[];
}
