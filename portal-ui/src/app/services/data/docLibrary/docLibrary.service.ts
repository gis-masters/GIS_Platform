import { PageOptions } from '../../models';
import { ExplorerItemEntityTypeTitle } from '../../../components/Explorer/Explorer.models';
import { addEntityPermission, removeEntityPermission } from '../permissions/permissions.service';
import { RoleAssignmentBody } from '../permissions/permissions.models';
import { communicationService } from '../../communication.service';

import { DocumentLibrary, LibraryRecord, LibraryRecordNew, LibraryRecordRaw } from './docLibrary.models';
import { docLibraryClient } from './docLibrary.client';

export async function getLibraries(pageOptions: PageOptions): Promise<[DocumentLibrary[], number]> {
  const response = await docLibraryClient.getLibraries(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getLibrariesWithParticularOne(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[DocumentLibrary[], number, number] | undefined> {
  return await docLibraryClient.getLibrariesWithParticularOne(libraryTableName, pageOptions);
}

export async function getLibrary(libraryTableName: string): Promise<DocumentLibrary> {
  return await docLibraryClient.getLibrary(libraryTableName);
}

export async function getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecord> {
  const { schemaId } = await getLibrary(libraryTableName);
  const response = await docLibraryClient.getLibraryRecord(libraryTableName, recordId);

  return { ...response, libraryTableName, schemaId };
}

export async function getLibraryRecords(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await docLibraryClient.getLibraryRecords(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await docLibraryClient.getLibraryRecordsAsRegistry(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  const response = await docLibraryClient.getAllLibraryRecordsAsRegistry(libraryTableName, pageOptions);

  return enrichLibraryRecordsResponse(response, libraryTableName, schemaId);
}

function enrichLibraryRecordsResponse(
  responseItems: { content: LibraryRecordRaw }[],
  libraryTableName: string,
  schemaId: string
): LibraryRecord[] {
  return responseItems.map(
    (linkedHashMap: { content: LibraryRecordRaw }): LibraryRecord => ({
      ...linkedHashMap.content,
      libraryTableName,
      schemaId
    })
  );
}

export async function getLibraryRecordsWithParticularOne(
  libraryTableName: string,
  schemaId: string,
  id: number,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number, number] | undefined> {
  const response = await docLibraryClient.getLibraryRecordsWithParticularOne(libraryTableName, id, pageOptions);

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
  data: LibraryRecordNew,
  libraryTableName: string,
  schemaId: string
): Promise<LibraryRecord> {
  const record = await docLibraryClient.createLibraryRecord(data, libraryTableName);
  const result = { schemaId, libraryTableName, ...record };
  communicationService.libraryRecordUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function registerDocument(libraryTableName: string, recordId: number): Promise<void> {
  await docLibraryClient.registerDocument(libraryTableName, recordId);
}

export async function deleteLibraryRecord(record: LibraryRecord): Promise<void> {
  await docLibraryClient.deleteLibraryRecord(record.id, record.libraryTableName);
  communicationService.libraryRecordUpdated.emit({ type: 'delete', data: record });
}

export async function updateLibraryRecord(record: LibraryRecord, patch: Partial<LibraryRecord>): Promise<void> {
  await docLibraryClient.updateLibraryRecord(record.libraryTableName, record.id, patch);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function moveLibraryRecord(record: LibraryRecord, newParentId?: number): Promise<void> {
  await docLibraryClient.moveLibraryRecord(record.libraryTableName, record.id, newParentId);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function getDocumentPermissions(item: LibraryRecord): Promise<RoleAssignmentBody[]> {
  return await docLibraryClient.getDocumentPermissions(item.libraryTableName, item.id);
}

export async function setDocumentPermission(item: LibraryRecord, payload: RoleAssignmentBody): Promise<void> {
  const url = docLibraryClient.getDocumentLibraryRecordRoleAssignmentUrl(item.libraryTableName, item.id);

  const permissions = await getDocumentPermissions(item);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

export async function getLibraryPermissions(library: DocumentLibrary): Promise<RoleAssignmentBody[]> {
  return await docLibraryClient.getLibraryPermissions(library.table_name);
}

export async function setLibraryPermission(library: DocumentLibrary, payload: RoleAssignmentBody): Promise<void> {
  const url = docLibraryClient.getDocumentLibraryRoleAssignmentUrl(library.table_name);

  const permissions = await getLibraryPermissions(library);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

export async function sendToSed(libraryTableName: string, recordId: number): Promise<void> {
  await docLibraryClient.sendToSed(libraryTableName, recordId);
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
