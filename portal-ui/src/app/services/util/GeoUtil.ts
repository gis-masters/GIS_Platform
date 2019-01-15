import {ImportTask, ImportTasks} from '../geoserver/import.service';

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
}
