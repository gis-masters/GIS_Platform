import { PageOptions } from '../../models';
import {
  getDocumentLibraryRecordRoleAssignmentUrl,
  getDocumentLibraryRoleAssignmentUrl
} from '../../api/server-urls.service';
import { ExplorerItemEntityTypeTitle } from '../../../components/Explorer/Explorer.models';
import { addEntityPermission, removeEntityPermission } from '../permissions/permissions.service';
import { RoleAssignmentBody } from '../permissions/permissions.models';
import { communicationService } from '../../communication.service';

import { DocumentLibrary, LibraryRecord, LibraryRecordRaw } from './docLibrary.models';
import {
  _reqCreateLibraryRecord,
  _reqDeleteLibraryRecord,
  _reqGetAllLibraryRecordsAsRegistry,
  _reqGetDocumentPermissions,
  _reqGetLibraries,
  _reqGetLibrariesWithParticularOne,
  _reqGetLibrary,
  _reqGetLibraryPermissions,
  _reqGetLibraryRecord,
  _reqGetLibraryRecords,
  _reqGetLibraryRecordsAsRegistry,
  _reqGetLibraryRecordsWithParticularOne,
  _reqMoveLibraryRecord,
  _reqRegisterDocument,
  _reqUpdateLibraryRecord
} from './docLibrary.client';

export async function getLibraries(pageOptions: PageOptions): Promise<[DocumentLibrary[], number]> {
  const response = await _reqGetLibraries(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getLibrariesWithParticularOne(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[DocumentLibrary[], number, number] | undefined> {
  return await _reqGetLibrariesWithParticularOne(libraryTableName, pageOptions);
}

export async function getLibrary(libraryTableName: string): Promise<DocumentLibrary> {
  return await _reqGetLibrary(libraryTableName);
}

export async function getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecord> {
  const { schemaId } = await getLibrary(libraryTableName);
  const response = await _reqGetLibraryRecord(libraryTableName, recordId);

  return { ...response, libraryTableName, schemaId };
}

export async function getLibraryRecords(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await _reqGetLibraryRecords(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await _reqGetLibraryRecordsAsRegistry(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  const response = await _reqGetAllLibraryRecordsAsRegistry(libraryTableName, pageOptions);

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
  id: number,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number, number] | undefined> {
  const response = await _reqGetLibraryRecordsWithParticularOne(libraryTableName, id, pageOptions);

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
  const record = await _reqCreateLibraryRecord(data, libraryTableName);
  const result = { schemaId, libraryTableName, ...record };
  communicationService.libraryRecordUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function registerDocument(libraryTableName: string, recordId: number): Promise<void> {
  await _reqRegisterDocument(libraryTableName, recordId);
}

export async function deleteLibraryRecord(record: LibraryRecord): Promise<void> {
  await _reqDeleteLibraryRecord(record.id, record.libraryTableName);
  communicationService.libraryRecordUpdated.emit({ type: 'delete', data: record });
}

export async function updateLibraryRecord(record: LibraryRecord, patch: Partial<LibraryRecord>): Promise<void> {
  await _reqUpdateLibraryRecord(record.libraryTableName, record.id, patch);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function moveLibraryRecord(record: LibraryRecord, newParentId?: number): Promise<void> {
  await _reqMoveLibraryRecord(record.libraryTableName, record.id, newParentId);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function getDocumentPermissions(item: LibraryRecord): Promise<RoleAssignmentBody[]> {
  return await _reqGetDocumentPermissions(item.libraryTableName, item.id);
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

export async function getLibraryPermissions(library: DocumentLibrary): Promise<RoleAssignmentBody[]> {
  return await _reqGetLibraryPermissions(library.table_name);
}

export async function setLibraryPermission(library: DocumentLibrary, payload: RoleAssignmentBody): Promise<void> {
  const url = await getDocumentLibraryRoleAssignmentUrl(library.table_name);

  const permissions = await getLibraryPermissions(library);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

// for autotests
if (typeof window !== undefined) {
  Object.assign(window, {
    getLibraries,
    setLibraryPermission,
    getLibraryRecords,
    createLibraryRecord
  });
}
