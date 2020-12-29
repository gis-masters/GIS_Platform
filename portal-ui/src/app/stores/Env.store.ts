import { observable, action } from 'mobx';

import { Platform, Environment, EnvironmentServer } from '../services/environment';
import { FlagsList } from '../services/feature-flags';

const emptyEnv: Environment = {
  platform: 'simf',
  production: true,
  server: {},
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
  @observable scratchWorkspaceName: string;
  @observable flags?: FlagsList;
  @observable logo?: string;
  @observable favicon?: string;
  @observable loaded = false;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
  
  private constructor() { }

  @action
  setEnv(env: Environment) {
    Object.assign(this, emptyEnv, env);
    this.loaded = true;
  }
}

export const env = Env.instance;
