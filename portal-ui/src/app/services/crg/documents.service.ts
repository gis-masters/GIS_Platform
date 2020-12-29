import { AxiosError } from 'axios';

import { getBaseUrl } from '../server-urls.service';
import { services } from '../services';
import { http } from '../http.service';
import { Toast } from '../../components/Toast/Toast';

export interface TemporaryDocumentBody {
  title: string;
  size: number;
}

export interface CrgDocument {
  id: string;
}

class DocumentsService {
  private static _instance: DocumentsService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async upload(file: File, fileName: string, uri: string): Promise<CrgDocument[]> {
    const body: TemporaryDocumentBody = {
      title: fileName,
      size: file.size
    };

    const formData = new FormData();
    formData.append('files', file);
    formData.append('body', JSON.stringify(body));

    const baseUrl = await getBaseUrl();

    return await http.post<CrgDocument[]>(baseUrl + uri, formData).catch((error: AxiosError) => {
      Toast.error('Возникла ошибка при загрузке файла');
      services.logger.error('Возникла ошибка при загрузке файла: ', error.message);

      return null;
    });
  }

  async delete(uri: string) {
    const baseUrl = await getBaseUrl();
    await http.delete(baseUrl + uri).catch((error: AxiosError) => {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', error.message);
    });
  }
}

export const documentsService = DocumentsService.instance;
