import { http } from '../http.service';
import { PageableResponse, PageOptions, SortDir } from '../models';
import { DataEntity, DataEntityType } from '../data.service';
import {
  getDocLibrariesRecordsUrl,
  getDocLibrariesRecordUrl,
  getDocLibrariesUrl,
  getDocLibraryUrl
} from '../server-urls.service';
import { Role } from './permissions.models';
import { communicationService } from '../communication.service';

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

  async getAllLibraries(
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[DocumentLibrary[], number]> {
    const response = await http.get<PageableResponse<{ libraries: DocumentLibrary[] }>>(await getDocLibrariesUrl(), {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    });

    return [(response._embedded && response._embedded.libraries) || [], response.page.totalPages];
  }

  async getLibrary(identifier: string): Promise<DocumentLibrary> {
    return await http.get<DocumentLibrary>(await getDocLibraryUrl(identifier));
  }

  async getRecords(
    libraryId: string,
    schemaId: string,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[LibraryRecord[], number]> {
    const url = await getDocLibrariesRecordsUrl(libraryId);
    const params = {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    };

    const response = await http.get<PageableResponse<{ records: { content: LibraryRecordRaw }[] }>>(url, params);

    const libraryRecords = (response._embedded?.records || []).map(linkedHashMap => ({
      ...(linkedHashMap.content || []),
      libraryId: libraryId,
      schemaId: schemaId
    }));

    return [libraryRecords, response.page.totalPages];
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
