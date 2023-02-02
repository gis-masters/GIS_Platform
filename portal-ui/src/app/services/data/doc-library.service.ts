import { http } from '../http.service';
import { PageableResponse, PageOptions } from '../models';
import { DataEntity, DataEntityType } from './data.service';
import {
  getDocLibrariesRecordMoveToFolderUrl,
  getDocLibrariesRecordMoveUrl,
  getDocLibrariesRecordsAsRegistryUrl,
  getDocLibrariesRecordsUrl,
  getDocLibrariesRecordUrl,
  getDocLibrariesUrl,
  getDocLibraryUrl,
  getDocRegisterUrl,
  getDocumentLibraryRecordRoleAssignmentUrl
} from '../server-urls.service';
import { ExplorerItemEntityTypeTitle } from '../../components/Explorer/Explorer.models';
import { addEntityPermission, removeEntityPermission } from './permissions.client';
import { Role, RoleAssignmentBody } from './permissions.models';
import { communicationService } from '../communication.service';
import { preparePageOptions } from '../http.utils';
import { PageableResources } from '../../../server-types/common-contracts';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends Omit<DataEntity, 'identifier'> {
  type: DataEntityType.LIBRARY;
  table_name: string;
  role: Role;
}

export interface LibraryRecord {
  [key: string]: unknown;

  id?: number;
  type?: string;
  title?: string;
  details?: string;
  created_at?: string;
  inner_path?: string;
  parent?: string;
  path?: string;
  content_type_id?: string;
  oktmo?: string;
  intents?: string;
  native_crs?: string;

  libraryTableName: string;
  schemaId: string;

  role?: Role;
}

export type LibraryRecordRaw = Omit<LibraryRecord, 'libraryName' | 'schemaId'>;

export async function getLibraries(pageOptions: PageOptions): Promise<[DocumentLibrary[], number]> {
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResources<DocumentLibrary>>(await getDocLibrariesUrl(), { params });

  return [response.content || [], response.page.totalPages];
}

export async function getLibrariesWithParticularOne(
  tableName: string,
  pageOptions: PageOptions
): Promise<[DocumentLibrary[], number, number] | undefined> {
  return await http.getPageWithObject<DocumentLibrary>(
    await getDocLibrariesUrl(),
    preparePageOptions(pageOptions, true),
    (item: DocumentLibrary) => item.table_name === tableName,
    {},
    false
  );
}

export async function getLibrary(tableName: string): Promise<DocumentLibrary> {
  return await http.get<DocumentLibrary>(await getDocLibraryUrl(tableName));
}

export async function getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecord> {
  const { schemaId } = await getLibrary(libraryTableName);
  const response = await http.get<LibraryRecord>(await getDocLibrariesRecordUrl(libraryTableName, recordId));

  response.libraryTableName = libraryTableName;
  response.schemaId = schemaId;

  return response;
}

export async function getLibraryRecords(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const url = await getDocLibrariesRecordsUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const url = await getDocLibrariesRecordsAsRegistryUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  const url = await getDocLibrariesRecordsAsRegistryUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions({ ...pageOptions, pageSize: null }, true) };
  const response = await http.getPagedOld<{ content: LibraryRecordRaw }>(url, requestOptions);

  return enrichLibraryRecordsResponse(response, libraryTableName, schemaId);
}

function enrichLibraryRecordsResponse(
  responseItems: { content: LibraryRecordRaw }[],
  libraryTableName: string,
  schemaId: string
): LibraryRecord[] {
  return responseItems.map(linkedHashMap => ({
    ...linkedHashMap.content,
    libraryTableName,
    schemaId
  }));
}

export async function getLibraryRecordsWithParticularOne(
  libraryTableName: string,
  schemaId: string,
  id: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number, number] | undefined> {
  const objectRecognizer = (item: { content: LibraryRecord }) => Number(item.content.id) === Number(id);

  const response = await http.getPageWithObject<{ content: LibraryRecord }>(
    await getDocLibrariesRecordsUrl(libraryTableName),
    preparePageOptions(pageOptions, true),
    objectRecognizer,
    {},
    true
  );

  if (response) {
    const [content, totalPages, page] = response;

    const records = content.map(item => {
      return item.content;
    });

    records.forEach(record => {
      record.libraryTableName = libraryTableName;
      record.schemaId = schemaId;
    });

    return [records, totalPages, page];
  }
}

export async function createLibraryRecord(
  data: LibraryRecordRaw,
  libraryTableName: string,
  schemaId: string
): Promise<LibraryRecord> {
  const record = await http.post<LibraryRecord>(
    await getDocLibrariesRecordsUrl(libraryTableName),
    prepareFormData(data)
  );

  const result = { schemaId, libraryTableName, ...record };

  communicationService.libraryRecordUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function registerDocument(libraryTableName: string, recordId: number): Promise<void> {
  await http.post<void>(await getDocRegisterUrl(libraryTableName, recordId));
}

export async function deleteLibraryRecord(record: LibraryRecord): Promise<void> {
  await http.delete(await getDocLibrariesRecordUrl(record.libraryTableName, record.id));
  communicationService.libraryRecordUpdated.emit({ type: 'delete', data: record });
}

export async function updateLibraryRecord(record: LibraryRecord, patch: Partial<LibraryRecord>): Promise<void> {
  await http.patch(await getDocLibrariesRecordUrl(record.libraryTableName, record.id), patch);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function moveLibraryRecord(record: LibraryRecord, newParentId?: number): Promise<void> {
  await (newParentId
    ? http.post(await getDocLibrariesRecordMoveToFolderUrl(record.libraryTableName, record.id, newParentId))
    : http.post(await getDocLibrariesRecordMoveUrl(record.libraryTableName, record.id)));
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

function prepareFormData(data: LibraryRecordRaw): FormData {
  const formData = new FormData();
  if (data.binary) {
    formData.append('file', data.binary as File);
    delete data.binary;
  }

  formData.append('body', JSON.stringify(data));

  return formData;
}

export async function getDocumentPermissions(item: LibraryRecord): Promise<RoleAssignmentBody[]> {
  const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.libraryTableName, item.id);

  return await http.getPagedOld<RoleAssignmentBody>(url);
}

export async function setDocumentPermission(item: LibraryRecord, payload: RoleAssignmentBody): Promise<void> {
  const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.libraryTableName, item.id);

  const permissions = await getDocumentPermissions(item);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

// for autotests
if (typeof window !== undefined) {
  Object.assign(window, { createLibraryRecord });
}
