import { ImportTaskResponse, ImportTaskShort } from '../geoserver/import/models';

export class GeoUtil {
  /**
   * Приведем в нормальный вид ответ от API геосервера.
   * @param importTask Объект с тасками полученный от геосервера
   */
  static tasksHandler(importTask?: ImportTaskResponse): ImportTaskShort[] {
    if (!importTask) {
      return [];
    }

    return importTask.task ? [importTask.task] : importTask.tasks || [];
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
