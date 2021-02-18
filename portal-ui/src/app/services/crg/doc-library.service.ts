import { AxiosError } from 'axios';
import { communicationService } from '../communication.service';

import { services } from '../services';
import { http } from '../http.service';
import { DataEntity, DataEntityType } from '../data.service';
import { Toast } from '../../components/Toast/Toast';
import { PageableResponse, SortDir } from '../models';
import { getBaseUrl, getDocLibrariesRecordsUrl, getDocLibrariesUrl } from '../server-urls.service';

export interface LibraryItem {
  [key: string]: unknown;
}

interface LibraryItemContent {
  content: LibraryItem;
}

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends DataEntity {
  type: DataEntityType.LIBRARY;
}

export interface TemporaryDocumentBody {
  title: string;
  size: number;
}

export interface CrgDocument {
  id: string;
}

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

    const response = await http.get<PageableResponse<{ linkedHashMaps: LibraryItemContent[] }>>(url, params);

    const libItems = response._embedded?.linkedHashMaps.map(({ content }) => content) || [];

    return [libItems, response.page.totalPages];
  }

  async createRecordWithBinary(file: File, fileName: string, uri: string): Promise<CrgDocument[]> {
    const body: TemporaryDocumentBody = {
      title: fileName,
      size: file.size
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('body', JSON.stringify(body));

    const baseUrl = await getBaseUrl();

    return await http.post<CrgDocument[]>(baseUrl + uri + '/records', formData).catch((error: AxiosError) => {
      Toast.error('Возникла ошибка при загрузке файла');
      services.logger.error('Возникла ошибка при загрузке файла: ', error.message);

      return null;
    });
  }

  async createRecord(libraryName: string, formValue: { [key: string]: unknown }): Promise<CrgDocument[]> {
    const formData = this.prepareFormData(formValue);

    const url = await getDocLibrariesRecordsUrl(libraryName);

    const result = await http.post<CrgDocument[]>(url, formData).catch((error: AxiosError) => {
      Toast.error('Возникла ошибка сохранения записи');
      services.logger.error('Возникла ошибка сохранения записи: ', error.message);

      return null;
    });

    communicationService.libraryItemsUpdated.emit();

    return result;
  }

  async delete(uri: string) {
    const baseUrl = await getBaseUrl();
    await http.delete(baseUrl + uri).catch((error: AxiosError) => {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', error.message);
    });
  }

  private prepareFormData(formValue: { [key: string]: unknown }) {
    const formData = new FormData();
    if (!!formValue.binary) {
      formData.append('file', formValue.binary as File);
      delete formValue.binary;
    }

    formData.append('body', JSON.stringify(formValue));

    return formData;
  }
}

export const docLibraryService = DocLibraryService.instance;
