import {ConnectionInfo} from '../geoserver/layers.service';
import {ImportTask, ImportTasks} from '../geoserver/import/models';

export class GeoUtil {

  /**
   * Приведем в нормальный вид ответ от API геосервера.
   * @param importTask Обьект с тасками полученный от геосервера
   */
  static tasksHandler(importTask?: ImportTask): ImportTasks {
    const result = {
      tasks: []
    };

    if (!importTask) {
      return result;
    }

    if (importTask.task) {
      result.tasks.push(importTask.task);
    } else {
      result.tasks = [...importTask.tasks];
    }

    return result;
  }

  static replaceUrl(url: string, envServer: { host: string; port: number }): string {
    const gatewayUrl = envServer.host + ':' + envServer.port;

    const firstSplit = url.split('//');
    const secondSplit = firstSplit[1].split('/');
    const thirdSplit = firstSplit[1].split(secondSplit[0] + '/');

    return firstSplit[0] + '//' + gatewayUrl + '/' + thirdSplit[1];
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

  static getDbInfo(connectionParameters: any, complexLayerName: string): ConnectionInfo {
    let dbName = '';
    let schemaName = '';
    let tableName = '';

    if (complexLayerName.split(':')[1]) {
      tableName = complexLayerName.split(':')[1];
    } else {
      tableName = complexLayerName;
    }

    connectionParameters.entry.forEach((item) => {
      if (item['@key'] === 'database') {
        dbName = item['$'];
      }
      if (item['@key'] === 'schema') {
        schemaName = item['$'];
      }
    });

    // На геосервере может быть не указана схема(подразумевается public) а вернется пустая строка.
    if (!schemaName) {
      schemaName = 'public';
    }

    return {
      dbName: dbName,
      schemaName: schemaName,
      tableName: tableName
    };

  }
}
