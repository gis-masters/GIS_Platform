import { ImportTaskResponse, ImportTaskShort } from '../geoserver/import/import.models';

export const GeoUtil = {
  /**
   * Приведем в нормальный вид ответ от API геосервера.
   * @param importTask Объект с тасками полученный от геосервера
   */
  tasksHandler(importTask?: ImportTaskResponse): ImportTaskShort[] {
    if (!importTask) {
      return [];
    }

    return importTask.task ? [importTask.task] : importTask.tasks || [];
  },

  getAliasForBaseType(type: string): string {
    if (type.toLowerCase() === 'string') {
      return 'Строка';
    } else if (type.toLowerCase() === 'integer') {
      return 'Целое';
    } else if (type.toLowerCase() === 'long') {
      return 'Целое';
    } else if (type.toLowerCase() === 'double') {
      return 'Дробное';
    }

    return type;
  }
};
