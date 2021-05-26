import { http } from '../http.service';
import { PageableResponse, SortDir } from '../models';
import { DataEntity, DataEntityType } from '../data.service';
import { getDocLibrariesRecordsUrl, getDocLibrariesRecordUrl, getDocLibrariesUrl } from '../server-urls.service';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends DataEntity {
  type: DataEntityType.LIBRARY;
}

export interface CrgDocument {
  id: string;
}

export interface LibraryRecord {
  [key: string]: unknown;

  id?: string;
  title?: string;
  inner_path?: string;
  parent?: string;
  content_type_id?: string;
  oktmo?: string;
  human_path?: string;

  libraryId: string;
  schemaId: string;
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

  async getAllRecords(
    libraryId: string,
    schemaId: string,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[LibraryRecord[], number]> {
    const url = await getDocLibrariesRecordsUrl(libraryId);
    const params = {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    };

    const response = await http.get<PageableResponse<{ linkedHashMaps: { content: LibraryRecordRaw }[] }>>(url, params);

    const libraryRecords = (response._embedded?.linkedHashMaps || []).map(linkedHashMap => ({
      ...(linkedHashMap.content || []),
      libraryId: libraryId,
      schemaId: schemaId
    }));

    return [libraryRecords, response.page.totalPages];
  }

  async createRecord(libraryId: string, data: LibraryRecordRaw): Promise<CrgDocument> {
    return await http.post<CrgDocument>(await getDocLibrariesRecordsUrl(libraryId), this.prepareFormData(data));
  }

  async deleteRecord(libraryId: string, id: string) {
    await http.delete(await getDocLibrariesRecordUrl(libraryId, id));
  }

  private prepareFormData(data: LibraryRecordRaw) {
    const formData = new FormData();
    if (!!data.binary) {
      formData.append('file', data.binary as File);
      delete data.binary;
    }

    formData.append('body', JSON.stringify(data));

    return formData;
  }
}

export const docLibraryService = DocLibraryService.instance;
