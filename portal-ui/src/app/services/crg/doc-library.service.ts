import { http } from '../http.service';
import { PageableResponse, SortDir } from '../models';
import { DataEntity, DataEntityType } from '../data.service';
import { getDocLibrariesRecordsUrl, getDocLibrariesRecordUrl, getDocLibrariesUrl } from '../server-urls.service';

export interface LibraryItem {
  id: string;
  library: string;
  schemaId: string;
  [key: string]: unknown;
}

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends DataEntity {
  type: DataEntityType.LIBRARY;
}

export interface CrgDocument {
  id: string;
}

type FormData = { [key: string]: unknown };

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
    libraryName: string,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[LibraryItem[], number]> {
    const url = await getDocLibrariesRecordsUrl(libraryName);
    const params = {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    };

    const response = await http.get<PageableResponse<{ linkedHashMaps: { content: LibraryItem }[] }>>(url, params);

    const libItems = response._embedded?.linkedHashMaps.map(({ content }) => content) || [];

    return [libItems, response.page.totalPages];
  }

  async createRecord(libraryName: string, data: FormData): Promise<CrgDocument> {
    return await http.post<CrgDocument>(await getDocLibrariesRecordsUrl(libraryName), this.prepareFormData(data));
  }

  async deleteRecord(libraryName: string, id: string) {
    await http.delete(await getDocLibrariesRecordUrl(libraryName, id));
  }

  private prepareFormData(data: FormData) {
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
