import {serverProperties} from '../server-properties.service';
import {services} from '../services';
import {CrgSource} from './projects.models';

class DataService {
  private static _instance: DataService;

  private constructor() {
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async getSourceInfo(schemaName: string, tableName: string): Promise<CrgSource> {
    const url = await serverProperties.dataServerUrl + '/schemas/' + schemaName + '/tables/' + tableName;

    return services.httpq.get<CrgSource>(url).catch(reason => null);
  }

}

export const dataService = DataService.instance;
