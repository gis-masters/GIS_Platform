import {ImportTaskResponse, ImportTaskFull} from '../geoserver/import/models';

export class GeoUtil {

  /**
   * Приведем в нормальный вид ответ от API геосервера.
   * @param importTask Обьект с тасками полученный от геосервера
   */
  static tasksHandler(importTask?: ImportTaskResponse): ImportTaskFull[] {
    if (!importTask) {
      return [];
    }

    return importTask.task ? [importTask.task] : importTask.tasks || [];
  }

  static replaceUrl(url: string, envServer: { host: string; port: number }): string {
    if (!url) {
      return '';
    }

    const newUrl = new URL(url);

    newUrl.host = envServer.host;
    newUrl.port = String(envServer.port);

    return newUrl.href;
  }

  static getAliasForBaseType(type: string) {
    if (type.toLowerCase() === 'string') {
      return 'Строка';
    } else if (type.toLowerCase() === 'integer') {
      return 'Целое';
    } else if (type.toLowerCase() === 'long') {
      return 'Целое';
    } else if (type.toLowerCase() === 'double') {
      return 'Дробное';
    } else {
      return type;
    }
  }
}
