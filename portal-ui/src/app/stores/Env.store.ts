import { observable, action } from 'mobx';

import { Platform, getEnvironment, Environment, EnvironmentServer } from '../services/environment';

class Env implements Environment {
  @observable platform: Platform;
  @observable production: boolean;
  @observable server: EnvironmentServer;
  @observable ws_port: number;
  @observable scratchWorkspaceName: string;

  private static _instance: Env;

  private async loadEnv () {
    this.setEnv(await getEnvironment());
  }

  @action
  private setEnv (env: Environment) {
    const { platform, production, server, ws_port, scratchWorkspaceName } = env;
    this.platform = platform;
    this.production = production;
    this.server = server;
    this.ws_port = ws_port;
    this.scratchWorkspaceName = scratchWorkspaceName;
  }

  private constructor() {
    this.loadEnv();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const env = Env.instance;
