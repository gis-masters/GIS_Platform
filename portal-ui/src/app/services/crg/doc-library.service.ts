import { http } from '../http.service';
import { PageableResponse, PageOptions, SortDir } from '../models';
import { DataEntity, DataEntityType } from '../data.service';
import {
  getDocLibrariesRecordRecordsUrl,
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

export interface CrgDocument {
  id: string;
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

class DocLibraryService {
  private static _instance: DocLibraryService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async getLibraries(
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[DocumentLibrary[], number]> {
    const response = await http.get<PageableResponse<DocumentLibrary>>(await getDocLibrariesUrl(), {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    });

    return [(response._embedded && response._embedded.libraries) || [], response.page.totalPages];
  }

  async getLibrariesWithParticularOne(
    identifier: string,
    pageOptions: PageOptions
  ): Promise<[DocumentLibrary[], number, number] | undefined> {
    return await http.getPageWithObject<DocumentLibrary>(
      await getDocLibrariesUrl(),
      pageOptions,
      (item: DocumentLibrary) => item.identifier === identifier
    );
  }

  async getLibrary(identifier: string): Promise<DocumentLibrary> {
    const response = await http.get<DocumentLibrary>(await getDocLibraryUrl(identifier));
    response.identifier = identifier;

    return response;
  }

  async getDocLibrariesRecord(libraryId: string, id: string, schemaId: string): Promise<LibraryRecord> {
    const response = await http.get<LibraryRecord>(await getDocLibrariesRecordUrl(libraryId, id));

    response.libraryId = libraryId;
    response.schemaId = schemaId;

    return response;
  }

  async getRecords(libraryId: string, schemaId: string, pageOptions: PageOptions): Promise<[LibraryRecord[], number]> {
    const url = await getDocLibrariesRecordsUrl(libraryId);
    const requestOptions = { params: preparePageOptions(pageOptions) };

    const response = await http.get<PageableResponse<{ content: LibraryRecordRaw }>>(url, requestOptions);

    const libraryRecords = (response._embedded?.records || []).map(linkedHashMap => ({
      ...(linkedHashMap.content || []),
      libraryId: libraryId,
      schemaId: schemaId
    }));

    return [libraryRecords, response.page.totalPages];
  }

  async getRecordsWithParticularOne(
    libraryId: string,
    schemaId: string,
    id: string,
    pageOptions: PageOptions,
    parentId?: string
  ): Promise<[LibraryRecord[], number, number] | undefined> {
    const objectRecognizer = (item: { content: LibraryRecord }) => Number(item.content.id) === Number(id);

    const response = await http.getPageWithObject<{ content: LibraryRecord }>(
      parentId
        ? await getDocLibrariesRecordRecordsUrl(libraryId, parentId)
        : await getDocLibrariesRecordsUrl(libraryId),
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

  async createRecord(libraryId: string, data: LibraryRecordRaw): Promise<CrgDocument> {
    const record = await http.post<CrgDocument>(await getDocLibrariesRecordsUrl(libraryId), this.prepareFormData(data));
    communicationService.libraryItemsUpdated.emit();

    return record;
  }

  async deleteRecord(libraryId: string, id: string) {
    await http.delete(await getDocLibrariesRecordUrl(libraryId, id));
    communicationService.libraryItemsUpdated.emit();
  }

  async getRecord(libraryId: string, id: string) {
    return http.get<LibraryRecord>(await getDocLibrariesRecordUrl(libraryId, id));
  }

  private prepareFormData(data: LibraryRecordRaw) {
    const formData = new FormData();
    if (data.binary) {
      formData.append('file', data.binary as File);
      delete data.binary;
    }

    formData.append('body', JSON.stringify(data));

    return formData;
  }
}

export const docLibraryService = DocLibraryService.instance;
