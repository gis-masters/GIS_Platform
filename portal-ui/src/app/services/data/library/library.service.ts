import { PageOptions } from '../../models';
import { ExplorerItemEntityTypeTitle } from '../../../components/Explorer/Explorer.models';
import { addEntityPermission, removeEntityPermission } from '../permissions/permissions.service';
import { RoleAssignmentBody } from '../permissions/permissions.models';
import { communicationService } from '../../communication.service';

import { Library, DocumentVersion, LibraryRecord, LibraryRecordNew, LibraryRecordRaw } from './library.models';
import { libraryClient } from './library.client';

export async function getLibraries(pageOptions: PageOptions): Promise<[Library[], number]> {
  const response = await libraryClient.getLibraries(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getLibrariesWithParticularOne(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[Library[], number, number] | undefined> {
  return await libraryClient.getLibrariesWithParticularOne(libraryTableName, pageOptions);
}

export async function getLibrary(libraryTableName: string): Promise<Library> {
  return await libraryClient.getLibrary(libraryTableName);
}

export async function createLibrary(details: string, schemaId: string, versioned: boolean): Promise<Library> {
  const result = await libraryClient.createLibrary(details, schemaId, versioned);

  communicationService.libraryUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecord> {
  const { schemaId } = await getLibrary(libraryTableName);
  const response = await libraryClient.getLibraryRecord(libraryTableName, recordId);

  return { ...response, libraryTableName, schemaId };
}

export async function getLibraryRecords(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await libraryClient.getLibraryRecords(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getDocumentVersions(libraryTableName: string, id: number): Promise<[DocumentVersion]> {
  return await libraryClient.getDocumentVersions(libraryTableName, id);
}

export async function getLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await libraryClient.getLibraryRecordsAsRegistry(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response._embedded?.records || [], libraryTableName, schemaId);

  return [libraryRecords, response.page.totalPages];
}

export async function getAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  const response = await libraryClient.getAllLibraryRecordsAsRegistry(libraryTableName, pageOptions);

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
  const response = await libraryClient.getLibraryRecordsWithParticularOne(libraryTableName, id, pageOptions);

  if (response) {
    const [content, totalPages, page] = response;

    const records: LibraryRecord[] = content.map(item => {
      return { schemaId, libraryTableName, ...item.content };
    });

    return [records, totalPages, page];
  }
}

export async function createLibraryRecord(
  data: LibraryRecordNew,
  libraryTableName: string,
  schemaId: string
): Promise<LibraryRecord> {
  const record = await libraryClient.createLibraryRecord(data, libraryTableName);
  const result = { schemaId, libraryTableName, ...record };
  communicationService.libraryRecordUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function registerDocument(libraryTableName: string, recordId: number): Promise<void> {
  await libraryClient.registerDocument(libraryTableName, recordId);
}

export async function deleteLibraryRecord(record: LibraryRecord): Promise<void> {
  await libraryClient.deleteLibraryRecord(record.id, record.libraryTableName);
  communicationService.libraryRecordUpdated.emit({ type: 'delete', data: record });
}

export async function updateLibraryRecord(record: LibraryRecord, patch: Partial<LibraryRecord>): Promise<void> {
  await libraryClient.updateLibraryRecord(record.libraryTableName, record.id, patch);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function recoverLibraryRecord(record: LibraryRecord, recoverFolderId?: number): Promise<void> {
  await libraryClient.recoverLibraryRecord(record.libraryTableName, record.id, recoverFolderId);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function moveLibraryRecord(record: LibraryRecord, newParentId?: number): Promise<void> {
  await libraryClient.moveLibraryRecord(record.libraryTableName, record.id, newParentId);
  communicationService.libraryRecordUpdated.emit({ type: 'update', data: record });
}

export async function getDocumentPermissions(item: LibraryRecord): Promise<RoleAssignmentBody[]> {
  return await libraryClient.getDocumentPermissions(item.libraryTableName, item.id);
}

export async function setDocumentPermission(item: LibraryRecord, payload: RoleAssignmentBody): Promise<void> {
  const url = libraryClient.getDocumentLibraryRecordRoleAssignmentUrl(item.libraryTableName, item.id);

  const permissions = await getDocumentPermissions(item);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

export async function getLibraryPermissions(library: Library): Promise<RoleAssignmentBody[]> {
  return await libraryClient.getLibraryPermissions(library.table_name);
}

export async function setLibraryPermission(library: Library, payload: RoleAssignmentBody): Promise<void> {
  const url = libraryClient.getDocumentLibraryRoleAssignmentUrl(library.table_name);

  const permissions = await getLibraryPermissions(library);

  for (const permission of permissions) {
    if (permission.principalId === payload.principalId && permission.principalType === payload.principalType) {
      await removeEntityPermission(permission, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
    }
  }

  await addEntityPermission(payload, url, '', ExplorerItemEntityTypeTitle.DOCUMENT);
}

export async function sendToSed(libraryTableName: string, recordId: number): Promise<void> {
  await libraryClient.sendToSed(libraryTableName, recordId);
}

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, {
    getLibraries,
    setLibraryPermission,
    getLibraryRecords,
    createLibraryRecord
  });
}
