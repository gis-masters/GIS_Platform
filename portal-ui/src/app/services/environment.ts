import axios from 'axios';
import { env } from '../stores/Env.store';
import { FlagsList } from './feature-flags';

export type Platform = 'conv' | 'simf' | 'gisogd_public' | 'gisogd_private'; //

export interface EnvironmentServer {
  host: string;
  port: string;
  path: string;
  wsPort: string;
  wsPath: string;
  protocol: string;
}

export interface ProtocolsBoolean {
  http: boolean;
  https: boolean;
}

export interface Environment {
  platform: Platform;
  production: boolean;
  server: EnvironmentServer;
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

declare const browser: { options: { baseUrl: string } }; //для автотестов

const fetchEnv = async (): Promise<Environment> => {
  let baseUrl: string;

  if (typeof browser !== 'undefined') {
    baseUrl = browser.options.baseUrl;
  } else if (typeof window !== undefined) {
    baseUrl = window.location.origin;
  } else {
    throw new TypeError('Unknown environment');
  }

  const response = await axios.get<Environment>(baseUrl + '/assets/config/environment.json');
  const environment: Environment = response.data;

  const baseUrlParsed = new URL(baseUrl);

  environment.server = {
    host: environment.server.host || baseUrlParsed.hostname,
    path: environment.server.path,
    port: environment.server.port || baseUrlParsed.port,
    protocol: baseUrlParsed.protocol,
    wsPath: environment.server.wsPath,
    wsPort: environment.server.wsPort
  };

  env.setEnv(environment);

  return environment;
};

let envPromise: Promise<Environment>;

export async function getEnvironment(): Promise<Environment> {
  if (!envPromise) {
    envPromise = fetchEnv();
  }

  await envPromise;

  return env;
}

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { env });
}
