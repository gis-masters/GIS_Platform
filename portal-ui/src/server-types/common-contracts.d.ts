export interface SpatialReferenceSystem {
  authName: string;
  authSrid: number;
  srtext: string;
  proj4Text: string;
}

export interface DatasetAndTableModel {
  datasetTitle: string;
  datasetIdentifier: string;
  tableTitle: string;
  tableName: string;
}

export interface GeometryValidationResultDto {
  message: string;
  valid: boolean;
}

export interface TaskLogDto {
  eventType: string;
  taskId: number;
  createdBy: number;
}

export interface VerifyEcpResponse {
  message: string;
  signer: string;
  code: string;
  verified: boolean;
}

export interface FtsRequestDto {
  text: string;
  ecqlFilter: string;
  type: FtsType;
  bound: number;
  sources: { [index: string]: any }[];
}

export interface FtsResponseDto {
  type: FtsType;
  value: number;
  source: { [index: string]: any };
  payload: any;
  headlines: string[];
}

export interface ProjectCreateDto extends ProjectUpdateDto {
  parentId: number;
  default: boolean;
  folder: boolean;
}

export interface ProjectDto extends ProjectCreateDto {
  id: string;
  organizationId: string;
  createdAt: string;
  role: string;
  path: string;
}

export interface ProjectUpdateDto {
  name: string;
  bbox: string;
  description: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PageableResources<T> {
  content: T[];
  page: Page;
}

export interface SpecializationView {
  id: number;
  title: string;
  description: string;
  settings: Settings;
}

export interface TableContentModel {
  datasetIdentifier: string;
  tableIdentifier: string;
  content: string[];
  variables: { [index: string]: string };
}

export interface Settings {
  storageSize: number;
  reestrs: boolean;
  sedDialog: boolean;
  downloadXml: boolean;
  taskManagement: boolean;
  createProject: boolean;
  downloadFiles: boolean;
  showPermissions: boolean;
  editProjectLayer: boolean;
  createLibraryItem: boolean;
  importShp: boolean;
  downloadGml: boolean;
  viewBugReport: boolean;
  viewDocumentLibrary: boolean;
  viewServicesCalculator: boolean;
  favoritesEpsg: string[];
  defaultEpsg: string;
  tags: string[];
}

export type FtsType = 'DOCUMENT' | 'FEATURE';
