import { Page } from '../../../../server-types/common-contracts';
import { ExplorerItemEntityTypeTitle } from '../../../components/Explorer/Explorer.models';
import { communicationService } from '../../communication.service';
import { PageOptions } from '../../models';
import { RoleAssignmentBody } from '../../permissions/permissions.models';
import { addEntityPermission, removeEntityPermission } from '../../permissions/permissions.service';
import { Schema } from '../schema/schema.models';
import { convertNewToOldSchema, convertOldToNewSchema } from '../schema/schema.utils';
import { libraryClient } from './library.client';
import {
  DocumentVersion,
  Library,
  LibraryNew,
  LibraryRecord,
  LibraryRecordNew,
  LibraryRecordRaw
} from './library.models';

export async function getLibraries(pageOptions: PageOptions): Promise<[Library[], number]> {
  const response = await libraryClient.getLibraries(pageOptions);

  return [
    response.content?.map(library => {
      if (!library.schema) {
        throw new Error(`У библиотеки "${library.title}" нет схемы!`);
      }

      return { ...library, schema: convertOldToNewSchema(library.schema) };
    }) || [],
    response.page.totalPages
  ];
}

export async function getLibrariesWithParticularOne(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[Library[], number, number] | undefined> {
  const response = await libraryClient.getLibrariesWithParticularOne(libraryTableName, pageOptions);

  if (!response) {
    return;
  }

  const [libraries, totalPages, pageNumber] = response;

  return [
    libraries.map(library => ({ ...library, schema: convertOldToNewSchema(library.schema) })),
    totalPages,
    pageNumber
  ];
}

export async function getLibrary(libraryTableName: string): Promise<Library> {
  const library = await libraryClient.getLibrary(libraryTableName);

  return { ...library, schema: convertOldToNewSchema(library.schema) };
}

export async function createLibrary({ details, schemaId, versioned, readyForFts }: LibraryNew): Promise<Library> {
  const rawLibrary = await libraryClient.createLibrary(details || '', schemaId, versioned, readyForFts);
  const newLibrary = { ...rawLibrary, schema: convertOldToNewSchema(rawLibrary.schema) };

  communicationService.libraryUpdated.emit({ type: 'create', data: newLibrary });

  return newLibrary;
}

export async function getLibraryRecord(libraryTableName: string, recordId: number): Promise<LibraryRecord> {
  const { schema } = await getLibrary(libraryTableName);
  const response = await libraryClient.getLibraryRecord(libraryTableName, recordId);

  return { ...response, libraryTableName, schemaId: schema.name };
}

export async function getLibraryRecords(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await libraryClient.getLibraryRecords(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response.content || [], libraryTableName);

  return [libraryRecords, response.page.totalPages];
}

export async function getLibrarySchemaByRecord(record: LibraryRecord): Promise<Schema> {
  const library = await getLibrary(record.libraryTableName);

  return library.schema;
}

export async function getDocumentVersions(libraryTableName: string, id: number): Promise<[DocumentVersion]> {
  return await libraryClient.getDocumentVersions(libraryTableName, id);
}

export async function getLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], Page]> {
  const response = await libraryClient.getLibraryRecordsAsRegistry(libraryTableName, pageOptions);
  const libraryRecords = enrichLibraryRecordsResponse(response.content || [], libraryTableName);

  return [libraryRecords, response.page];
}

export async function getAllLibraryRecordsAsRegistry(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<LibraryRecord[]> {
  // при выгрузке сортируем только по id для предотвращения создания дублирующих записей
  const queryParams = { ...pageOptions.queryParams, sort: 'id,asc' };

  const response = await libraryClient.getAllLibraryRecordsAsRegistry(libraryTableName, {
    ...pageOptions,
    queryParams
  });

  return enrichLibraryRecordsResponse(response, libraryTableName);
}

function enrichLibraryRecordsResponse(
  responseItems: { content: LibraryRecordRaw }[],
  libraryTableName: string
): LibraryRecord[] {
  return responseItems.map(
    (linkedHashMap: { content: LibraryRecordRaw }): LibraryRecord => ({
      ...linkedHashMap.content,
      libraryTableName
    })
  );
}

export async function getLibraryRecordsWithParticularOne(
  libraryTableName: string,
  id: number,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number, number] | undefined> {
  const response = await libraryClient.getLibraryRecordsWithParticularOne(libraryTableName, id, pageOptions);

  if (response) {
    const [content, totalPages, page] = response;

    const records: LibraryRecord[] = content.map(item => {
      return { libraryTableName, ...item.content };
    });

    return [records, totalPages, page];
  }
}

export async function createLibraryRecord(data: LibraryRecordNew, libraryTableName: string): Promise<LibraryRecord> {
  const record = await libraryClient.createLibraryRecord(data, libraryTableName);
  const result = { libraryTableName, ...record };
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

export async function updateLibrarySchema(library: Library, schema: Schema): Promise<void> {
  await libraryClient.updateLibrarySchema(library.table_name, convertNewToOldSchema(schema));
  communicationService.libraryUpdated.emit({ type: 'update', data: { ...library, schema } });
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
    setLibraryPermission
  });
}
