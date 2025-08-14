import { FlagsList } from './feature-flags';

declare const browser: { options: { baseUrl: string } }; //для автотестов

export type Platform = 'conv' | 'simf' | 'gisogd_public' | 'gisogd_private'; //

interface EnvironmentServer {
  host: string;
  port: string;
  path: string;
  wsPort: string;
  wsPath: string;
  protocol: string;
}

interface EnvironmentAttribution {
  url?: string;
  title?: string;
}

interface ProtocolsBoolean {
  http: boolean;
  https: boolean;
}

const emptyEnv: EnvironmentData = {
  platform: 'simf',
  production: true,
  attribution: {},
  server: {
    host: '',
    path: '',
    port: '',
    protocol: '',
    wsPath: '',
    wsPort: ''
  },
  scratchWorkspaceName: '',
  flags: undefined,
  logo: undefined,
  favicon: undefined,
  suppressToastErrors: {
    http: false,
    https: false
  },
  sendErrorsToTG: {
    http: false,
    https: false
  }
};

export interface EnvironmentData {
  platform: Platform;
  production: boolean;
  server: EnvironmentServer;
  attribution: EnvironmentAttribution;
  scratchWorkspaceName: string;
  flags?: FlagsList;
  logo?: string;
  title?: string;
  owner?: string;
  contactsPhone?: string;
  contactsEmail?: string;
  description?: string;
  passwordRestore?: string;
  esia?: string;
  registration?: string;
  background?: string;
  favicon?: string;
  suppressToastErrors: ProtocolsBoolean;
  sendErrorsToTG: ProtocolsBoolean;
}

export class Environment implements EnvironmentData {
  private static _instance: Environment;
  static get instance(): Environment {
    return this._instance || (this._instance = new this());
  }

  inited = false;

  platform: Platform = emptyEnv.platform;
  production: boolean = emptyEnv.production;
  server: EnvironmentServer = emptyEnv.server;
  attribution: EnvironmentAttribution = emptyEnv.attribution;
  scratchWorkspaceName: string = emptyEnv.scratchWorkspaceName;
  flags?: FlagsList;
  logo?: string;
  title?: string;
  owner?: string;
  contactsPhone?: string;
  contactsEmail?: string;
  description?: string;
  passwordRestore?: string;
  esia?: string;
  registration?: string;
  background?: string;
  favicon?: string;
  suppressToastErrors: ProtocolsBoolean = emptyEnv.suppressToastErrors;
  sendErrorsToTG: ProtocolsBoolean = emptyEnv.sendErrorsToTG;

  private constructor() {
    if (typeof _environmentRaw === 'object') {
      this.init(_environmentRaw);
    }
  }

  init(data: EnvironmentData): void {
    let baseUrl: string;

    if (typeof browser === 'object' && browser && browser.options) {
      baseUrl = browser.options.baseUrl;
    } else if (typeof window === 'undefined') {
      throw new TypeError('Unknown environment');
    } else {
      baseUrl = window.location.origin;
    }

    const baseUrlParsed = new URL(baseUrl);

    const server: EnvironmentServer = {
      host: data.server?.host || baseUrlParsed.hostname,
      path: data.server?.path || '',
      port: data.server?.port || baseUrlParsed.port || '',
      protocol: baseUrlParsed.protocol,
      wsPath: data.server?.wsPath || '',
      wsPort: data.server?.wsPort || ''
    };

    Object.assign(this, emptyEnv, data, { server });

    this.inited = true;
  }
}

export const environment = Environment.instance;
