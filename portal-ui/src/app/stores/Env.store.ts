import { observable, action, makeObservable } from 'mobx';

import { Platform, Environment, EnvironmentServer, ProtocolsBoolean } from '../services/environment';
import { FlagsList } from '../services/feature-flags';

const emptyEnv: Environment = {
  platform: 'simf',
  production: true,
  server: {},
  scratchWorkspaceName: '',
  flags: null,
  logo: null,
  favicon: null,
  suppressToastErrors: {
    http: false,
    https: false
  },
  sendErrorsToTG: {
    http: false,
    https: false
  }
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
  @observable suppressToastErrors: ProtocolsBoolean;
  @observable sendErrorsToTG: ProtocolsBoolean;
  @observable title?: string;
  @observable owner?: string;
  @observable description?: string;
  @observable contactsPhone?: string;
  @observable contactsEmail?: string;
  @observable passwordRestore?: string;
  @observable esia?: string;
  @observable registration?: string;
  @observable background?: string;

  static get instance(): Env {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
  }

  @action
  setEnv(env: Environment): void {
    Object.assign(this, emptyEnv, env);
    this.loaded = true;
  }
}

export const env = Env.instance;
