import { services } from '../services';
import { Toast } from '../../components/Toast/Toast';
import { HttpErrorResponse } from '@angular/common/http';
import { serverProperties } from '../server-properties.service';

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

    const baseUrl = await serverProperties.baseUrl;

    return await services.httpq.post<CrgDocument[]>(baseUrl + uri, formData).catch((eResponse: HttpErrorResponse) => {
      Toast.error('Возникла ошибка при загрузке файла');

      if (eResponse && eResponse.error) {
        services.logger.error('Возникла ошибка при загрузке файла: ', eResponse.error.message);
      }

      return null;
    });
  }

  async delete(uri: string) {
    const baseUrl = await serverProperties.baseUrl;
    await services.httpq.delete(baseUrl + uri).catch(eResponse => {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', eResponse.message);
    });
  }
}

export const documentsService = DocumentsService.instance;
