import { http } from '../http.service';
import { PageableResponse, PageOptions } from '../models';
import { DataEntity, DataEntityType } from './data.service';
import {
  getDocLibrariesRecords2Url,
  getDocLibrariesRecordsUrl,
  getDocLibrariesRecordUrl,
  getDocLibrariesUrl,
  getDocLibraryUrl,
  getDocRegisterUrl,
  getDocumentLibraryRecordRoleAssignmentUrl
} from '../server-urls.service';
import { Role, RoleAssignmentBody } from './permissions.models';
import { communicationService } from '../communication.service';
import { preparePageOptions } from '../http.utils';
import { addEntityPermission, removeEntityPermission } from './permissions.client';
import { ExplorerItemEntityTypeTitle } from '../../components/Explorer/Explorer.models';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends DataEntity {
  type: DataEntityType.LIBRARY;
  role: Role;
}

export interface LibraryRecord {
  [key: string]: unknown;

  id?: number;
  type?: string;
  title?: string;
  details?: string;
  created_at?: string;
  // eslint-disable-next-line camelcase
  inner_path?: string;
  parent?: string;
  path?: string;
  // eslint-disable-next-line camelcase
  content_type_id?: string;
  oktmo?: string;
  identifier?: string;
  intents?: string;
  native_crs?: string;

  libraryId: string;
  schemaId: string;

  role?: Role;
}

export type LibraryRecordRaw = Omit<LibraryRecord, 'library' | 'schemaId'>;

export async function getLibraries(pageOptions: PageOptions): Promise<[DocumentLibrary[], number]> {
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResponse<DocumentLibrary>>(await getDocLibrariesUrl(), { params });

  return [(response._embedded && response._embedded.libraries) || [], response.page.totalPages];
}

export async function getLibrariesWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[DocumentLibrary[], number, number] | undefined> {
  return await http.getPageWithObject<DocumentLibrary>(
    await getDocLibrariesUrl(),
    preparePageOptions(pageOptions, true),
    (item: DocumentLibrary) => item.identifier === identifier
  );
}

export async function getLibrary(identifier: string): Promise<DocumentLibrary> {
  const response = await http.get<DocumentLibrary>(await getDocLibraryUrl(identifier));
  response.identifier = identifier;

  return response;
}

export async function getLibraryRecord(libraryId: string, recordId: number): Promise<LibraryRecord> {
  const { schemaId } = await getLibrary(libraryId);
  const response = await http.get<LibraryRecord>(await getDocLibrariesRecordUrl(libraryId, recordId));

  response.libraryId = libraryId;
  response.schemaId = schemaId;

  return response;
}

export async function getLibraryRecords(
  libraryId: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const url = await getDocLibrariesRecordsUrl(libraryId);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryId, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getLibraryRecords2(
  libraryId: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const url = await getDocLibrariesRecords2Url(libraryId);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryId, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getAllLibraryRecords(
  libraryId: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  const url = await getDocLibrariesRecords2Url(libraryId);
  const requestOptions = { params: preparePageOptions({ ...pageOptions, pageSize: null }, true) };
  const response = await http.getPaged<{ content: LibraryRecordRaw }>(url, requestOptions);

  return enrichLibraryRecordsResponse(response, libraryId, schemaId);
}

function enrichLibraryRecordsResponse(
  responseItems: { content: LibraryRecordRaw }[],
  libraryId: string,
  schemaId: string
): LibraryRecord[] {
  return responseItems.map(linkedHashMap => ({
    ...linkedHashMap.content,
    libraryId,
    schemaId
  }));
}

export async function getLibraryRecordsWithParticularOne(
  libraryId: string,
  schemaId: string,
  id: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number, number] | undefined> {
  const objectRecognizer = (item: { content: LibraryRecord }) => Number(item.content.id) === Number(id);

  const response = await http.getPageWithObject<{ content: LibraryRecord }>(
    await getDocLibrariesRecordsUrl(libraryId),
    preparePageOptions(pageOptions, true),
    objectRecognizer
  );

  if (response) {
    const [content, totalPages, page] = response;

    const records = content.map(item => {
      return item.content;
    });

    records.forEach(record => {
      record.libraryId = libraryId;
      record.schemaId = schemaId;
    });

    return [records, totalPages, page];
  }
}

export async function createLibraryRecord(
  data: LibraryRecordRaw,
  libraryIdentifier: string,
  schemaId: string
): Promise<LibraryRecord> {
  const record = await http.post<LibraryRecord>(
    await getDocLibrariesRecordsUrl(libraryIdentifier),
    prepareFormData(data)
  );

  communicationService.libraryItemsUpdated.emit();

  return { schemaId, libraryId: libraryIdentifier, ...record };
}

export async function registerDocument(libraryId: string, recordId: number): Promise<void> {
  await http.post<void>(await getDocRegisterUrl(libraryId, recordId));
}

export async function deleteLibraryRecord(libraryId: string, recordId: number): Promise<void> {
  await http.delete(await getDocLibrariesRecordUrl(libraryId, recordId));
  communicationService.libraryItemsUpdated.emit();
}

export async function updateLibraryRecord(
  libraryId: string,
  recordId: number,
  patch: Partial<LibraryRecord>
): Promise<void> {
  await http.patch(await getDocLibrariesRecordUrl(libraryId, recordId), patch);
  communicationService.libraryItemsUpdated.emit();
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
  const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.libraryId, item.id);

  return await http.getPaged<RoleAssignmentBody>(url);
}

export async function setDocumentPermission(item: LibraryRecord, payload: RoleAssignmentBody): Promise<void> {
  const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.libraryId, item.id);

  const permissions = await getDocumentPermissions(item);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}
