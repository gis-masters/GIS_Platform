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

export interface FileMetadata<T> {
  id: string;
  payload: T;
}

export interface FileResponse {
  id: string;
  title: string;
  size: number;
  extension: string;
  path: string;
  contentType: string;
  intents: string;
  createdBy: string;
  createdAt: string;
  signed: boolean;
  expired: boolean;
  resourceType: string;
  resourceQualifier: any;
}

export interface GeometryValidationResultDto {
  message: string;
  valid: boolean;
}

export interface LookupModel {
  key: string;
  payload: LookupPayload;
}

export interface LookupPayload {
  type: string;
  payload: any;
}

export interface TaskLogDto {
  eventType: string;
  taskId: number;
  createdBy: number;
}

export interface GpkgFileMetadata extends FileMetadata<GpkgTablesData[]> {
  payload: GpkgTablesData[];
}

export interface ExportGpkgPayload extends Serializable {
  type: GpkgExportType;
  payload: any;
}

export interface GpkgExportDetailsModel extends Serializable {
  pathToGpkgFile: string;
  messages: string[];
}

export interface GpkgImportBaseDto extends Serializable {
  title: string;
  status: GpkgProcessStatus;
  messages: string[];
}

export interface GpkgImportDestinationProject extends GpkgImportBaseDto, Serializable {
  projectId: number;
}

export interface GpkgImportReport extends GpkgImportBaseDto, Serializable {
  projectId: number;
  fileId: string;
  filePath: string;
  fileTitle: string;
  payload: GpkgPayloadData;
}

export interface GpkgImportedFile extends GpkgImportBaseDto, Serializable {
  newId: string;
  oldId: string;
  tableName: string;
  resourceQualifier: any;
}

export interface GpkgImportedLayer extends GpkgImportBaseDto, Serializable {
  createdTableId: number;
  styleName: string;
  type: LayerType;
}

export interface GpkgImportedStyles extends GpkgImportBaseDto, Serializable {
  createdTableId: number;
  name: string;
  body: string;
  svgs: GpkgImportedSvg[];
}

export interface GpkgImportedSvg extends GpkgImportBaseDto, Serializable {
  body: string;
}

export interface GpkgImportedTable extends GpkgImportBaseDto, Serializable {
  dataset: string;
  oldTableIdentifier: string;
  createdTableIdentifier: string;
  importedObjects: number;
  failedObjects: number;
}

export interface GpkgPayloadData extends Serializable {
  tablesInGpkg: GpkgTablesData[];
  project: GpkgImportDestinationProject;
  wrapperImportReport: GpkgWrapperImportReport;
  tables: GpkgImportedTable[];
  files: GpkgImportedFile[];
  styles: GpkgImportedStyles[];
  layers: GpkgImportedLayer[];
}

export interface GpkgTablesData extends Serializable {
  type: GpkgTableType;
  tableGpkgIdentifier: string;
  tableNewIdentifier: string;
  rowsCount: number;
}

export interface GpkgWrapperImportReport extends Serializable {
  failedRecordCount: number;
  utf8ErrorCount: number;
  results: { [ index: string ]: number };
  additionalInfo: string;
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
  sources: { [ index: string ]: any }[];
}

export interface FtsResponseDto {
  type: FtsType;
  value: number;
  source: { [ index: string ]: any };
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

export interface ReportMainDto {
  outputFormat: ReportOutputFormat;
  templateName: string;
  media: { [ index: string ]: string };
  data: any;
}

export interface TemplateCreateDto extends TemplateShortInfo {
  printFormSchemaOverrides: any;
}

export interface TemplateFullInfo extends TemplateCreateDto {
  id: number;
  createdBy: string;
  createdAt: string;
  system: boolean;
}

export interface TemplateShortInfo extends TemplateShortProjection {
}

export interface TemplateShortProjection {
  name: string;
  title: string;
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
  variables: { [ index: string ]: string };
}

export interface Serializable {
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
  defaultProjectBbox: string;
  favoritesEpsg: string[];
  defaultEpsg: string;
  tags: string[];
}

export type GpkgExportType = 'PROJECT' | 'LAYER' | 'TABLE';

export type GpkgProcessStatus = 'ACTIVE' | 'COMPLETED' | 'ERROR';

export type GpkgTableType = 'VECTOR_DATA_TABLE' | 'CRG_DATA_TABLE';

export type FtsType = 'DOCUMENT' | 'FEATURE';

export type LayerType =
  | 'VECTOR'
  | 'DXF'
  | 'TAB'
  | 'MID'
  | 'SHP'
  | 'RASTER'
  | 'EXTERNAL'
  | 'EXTERNAL_NSPD'
  | 'EXTERNAL_GEOSERVER';

export type ReportOutputFormat = 'PDF' | 'DOCX' | 'ODT' | 'JPEG';
