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

export interface GpkgImportedLayer extends GpkgImportBaseDto, Serializable {
    createdTableId: number;
    styleName: string;
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
}

export interface GpkgPayloadData extends Serializable {
    tablesInGpkg: GpkgTablesData[];
    project: GpkgImportDestinationProject;
    wrapperImportReport: GpkgWrapperImportReport;
    tables: GpkgImportedTable[];
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
    results: { [index: string]: number };
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

export interface GkpgExportDetailsModel extends Serializable {
    pathToGpkgFile: string;
    messageFromExport: MessageFromExport[];
}

export interface MessageFromExport extends Serializable {
    message: string;
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

export type GpkgProcessStatus = "ACTIVE" | "COMPLETED" | "ERROR";

export type GpkgTableType = "VECTOR_DATA_TABLE" | "CRG_DATA_TABLE";

export type FtsType = "DOCUMENT" | "FEATURE";
