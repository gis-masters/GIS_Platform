import {ImportTask, ImportTasks} from '../geoserver/import.service';
import {ValidationRequest} from "../validation.service";

export class GeoUtil {

  /**
   * Приведем в нормальный вид ответ от API геосервера.
   * @param importTask Обьект с тасками полученный от геосервера
   */
  static tasksHandler(importTask: ImportTask): ImportTasks {
    const result = {
      tasks: []
    };

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

  static getDbInfo(connectionParameters: any, layerName: string): ValidationRequest {
    let dbName = '';
    let schemaName = '';
    let tableName = '';

    if (layerName.split(':')[1]) {
      tableName = layerName.split(':')[1];
    } else {
      tableName = layerName;
    }

    console.log(' ** ', connectionParameters.entry);
    connectionParameters.entry.forEach((item) => {
      if (item['@key'] === 'database') {
        dbName = item['$'];
      }
      if (item['@key'] === 'schema') {
        schemaName = item['$'];
      }
    });

    return {
      dbName: dbName,
      schemaName: schemaName,
      tableName: tableName
    };

  }
}
