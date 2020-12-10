import { observable, action } from 'mobx';

import { Platform, getEnvironment, Environment, EnvironmentServer } from '../services/environment';
import { FlagsList } from '../services/feature-flags';

const emptyEnv: Environment = {
  platform: 'conv',
  production: true,
  server: { host: 'localhost', port: 80 },
  ws_port: 80,
  scratchWorkspaceName: '',
  flags: null,
  logo: null,
  favicon: null
};

class Env implements Environment {
  private static _instance: Env;

  @observable platform: Platform;
  @observable production: boolean;
  @observable server: EnvironmentServer;
  @observable ws_port: number;
  @observable scratchWorkspaceName: string;
  @observable flags?: FlagsList;
  @observable logo?: string;
  @observable favicon?: string;
  @observable loaded = false;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.loadEnv();
  }

  private async loadEnv() {
    this.setEnv(await getEnvironment());
  }

  @action
  private setEnv(env: Environment) {
    Object.assign(this, emptyEnv, env);
    this.loaded = true;
  }
}

export const env = Env.instance;
