import { http } from '../http.service';
import { PageableResponse, PageOptions } from '../models';
import { DataEntity, DataEntityType } from '../data.service';
import {
  getDocLibrariesRecords2Url,
  getDocLibrariesRecordsUrl,
  getDocLibrariesRecordUrl,
  getDocLibrariesUrl,
  getDocLibraryUrl
} from '../server-urls.service';
import { Role } from './permissions.models';
import { communicationService } from '../communication.service';
import { preparePageOptions } from '../http.utils';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends DataEntity {
  type: DataEntityType.LIBRARY;
  role: Role;
}

export interface LibraryRecord {
  [key: string]: unknown;

  id?: string;
  type?: string;
  title?: string;
  // eslint-disable-next-line camelcase
  inner_path?: string;
  parent?: string;
  path?: string;
  // eslint-disable-next-line camelcase
  content_type_id?: string;
  oktmo?: string;
  identifier?: string;
  intents?: string;

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
    pageOptions,
    (item: DocumentLibrary) => item.identifier === identifier
  );
}

export async function getLibrary(identifier: string): Promise<DocumentLibrary> {
  const response = await http.get<DocumentLibrary>(await getDocLibraryUrl(identifier));
  response.identifier = identifier;

  return response;
}

export async function getLibraryRecord(libraryId: string, id: string, schemaId: string): Promise<LibraryRecord> {
  const response = await http.get<LibraryRecord>(await getDocLibrariesRecordUrl(libraryId, id));

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

  const libraryRecords = (response._embedded?.records || []).map(linkedHashMap => ({
    ...(linkedHashMap.content || {}),
    libraryId,
    schemaId
  }));

  return [libraryRecords, response.page.totalPages];
}

// eslint-disable-next-line sonarjs/no-identical-functions
export async function getLibraryRecords2(
  libraryId: string,
  schemaId: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const url = await getDocLibrariesRecords2Url(libraryId);
  const requestOptions = { params: preparePageOptions(pageOptions, true) };

  const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

  // eslint-disable-next-line sonarjs/no-identical-functions
  const libraryRecords = (response._embedded?.records || []).map(linkedHashMap => ({
    ...(linkedHashMap.content || {}),
    libraryId,
    schemaId
  }));

  return [libraryRecords, response.page.totalPages];
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
    pageOptions,
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
  libraryId: string,
  data: LibraryRecordRaw,
  update = true
): Promise<LibraryRecord> {
  const record = await http.post<LibraryRecord>(await getDocLibrariesRecordsUrl(libraryId), prepareFormData(data));

  if (update) {
    communicationService.libraryItemsUpdated.emit();
  }

  return record;
}

export async function deleteLibraryRecord(libraryId: string, id: string): Promise<void> {
  await http.delete(await getDocLibrariesRecordUrl(libraryId, id));
  communicationService.libraryItemsUpdated.emit();
}

export async function updateLibraryRecord(libraryId: string, id: string, patch: Partial<LibraryRecord>): Promise<void> {
  await http.patch(await getDocLibrariesRecordUrl(libraryId, id), patch);
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
