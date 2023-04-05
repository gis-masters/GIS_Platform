import { PageableResources } from '../../../../server-types/common-contracts';
import {
  getDocLibraryRecordUrl,
  getDocLibrariesUrl,
  getDocLibraryUrl,
  getDocLibraryRecordsUrl,
  getDocLibraryRecordsAsRegistryUrl,
  getDocRegisterUrl,
  getDocLibraryRecordMoveToFolderUrl,
  getDocLibraryRecordMoveUrl,
  getDocumentLibraryRecordRoleAssignmentUrl,
  getDocumentLibraryRoleAssignmentUrl
} from '../../api/server-urls.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageableResponse, PageOptions } from '../../models';
import { RoleAssignmentBody } from '../permissions/permissions.models';
import { http } from '../../api/http.service';

import { DocumentLibrary, LibraryRecord, LibraryRecordRaw } from './docLibrary.models';

export async function _reqGetLibraries(pageOptions: PageOptions): Promise<PageableResources<DocumentLibrary>> {
  const params = preparePageOptions(pageOptions, true);

  return await http.get<PageableResources<DocumentLibrary>>(await getDocLibrariesUrl(), { params });
}

export async function _reqGetLibrariesWithParticularOne(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[DocumentLibrary[], number, number]> {
  return await http.getPageWithObject<DocumentLibrary>(
    await getDocLibrariesUrl(),
    preparePageOptions(pageOptions, true),
    (item: DocumentLibrary) => item.table_name === libraryTableName,
    {},
    false
  );
}

export async function _reqGetLibrary(libraryTableName: string): Promise<DocumentLibrary> {
  return await http.get<DocumentLibrary>(await getDocLibraryUrl(libraryTableName));
}

export async function _reqGetLibraryPermissions(libraryTableName: string): Promise<RoleAssignmentBody[]> {
  const url = await getDocumentLibraryRoleAssignmentUrl(libraryTableName);

  return await http.getPagedOld<RoleAssignmentBody>(url);
}

export async function _reqGetLibraryRecord(
  libraryTableName: string,
  recordId: number
): Promise<Omit<LibraryRecord, 'schemaId' | 'libraryTableName'>> {
  return http.get<Omit<LibraryRecord, 'libraryTableName' | 'schemaId'>>(
    await getDocLibraryRecordUrl(libraryTableName, recordId)
  );
}

export async function _reqGetLibraryRecords(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<PageableResponse<{ content: LibraryRecordRaw }>> {
  const url = await getDocLibraryRecordsUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  return http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);
}

export async function _reqGetLibraryRecordsAsRegistry(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<PageableResponse<{ content: LibraryRecordRaw }>> {
  const url = await getDocLibraryRecordsAsRegistryUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  return http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);
}

export async function _reqGetAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<{ content: LibraryRecordRaw }[]> {
  const url = await getDocLibraryRecordsAsRegistryUrl(libraryTableName);
  const requestOptions = { params: preparePageOptions({ ...pageOptions, pageSize: null }, true) };

  return http.getPagedOld<{ content: LibraryRecordRaw }>(url, requestOptions);
}

export async function _reqGetLibraryRecordsWithParticularOne(
  libraryTableName: string,
  id: number,
  pageOptions: PageOptions
): Promise<[{ content: LibraryRecord }[], number, number]> {
  const objectRecognizer = (item: { content: LibraryRecord }) => Number(item.content.id) === Number(id);

  return http.getPageWithObject<{ content: LibraryRecord }>(
    await getDocLibraryRecordsUrl(libraryTableName),
    preparePageOptions(pageOptions, true),
    objectRecognizer,
    {},
    true
  );
}

export async function _reqCreateLibraryRecord(
  data: LibraryRecordRaw,
  libraryTableName: string
): Promise<LibraryRecord> {
  return http.post<LibraryRecord>(await getDocLibraryRecordsUrl(libraryTableName), prepareFormData(data));
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

export async function _reqRegisterDocument(libraryTableName: string, recordId: number): Promise<void> {
  return http.post<void>(await getDocRegisterUrl(libraryTableName, recordId));
}

export async function _reqDeleteLibraryRecord(recordId: number, libraryTableName: string): Promise<void> {
  return http.delete(await getDocLibraryRecordUrl(libraryTableName, recordId));
}

export async function _reqUpdateLibraryRecord(
  libraryTableName: string,
  recordId: number,
  patch: Partial<LibraryRecord>
): Promise<void> {
  return http.patch(await getDocLibraryRecordUrl(libraryTableName, recordId), patch);
}

export async function _reqMoveLibraryRecord(
  libraryTableName: string,
  recordId: number,
  newParentId?: number
): Promise<void> {
  return newParentId
    ? http.post(await getDocLibraryRecordMoveToFolderUrl(libraryTableName, recordId, newParentId))
    : http.post(await getDocLibraryRecordMoveUrl(libraryTableName, recordId));
}

export async function _reqGetDocumentPermissions(
  libraryTableName: string,
  recordId: number
): Promise<RoleAssignmentBody[]> {
  const url = await getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName, recordId);

  return await http.getPagedOld<RoleAssignmentBody>(url);
}
