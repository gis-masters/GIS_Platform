import { env } from '../stores/Env.store';
import { FlagsList } from './feature-flags';

export type Platform = 'conv' | 'simf' | 'gisogd_public' | 'gisogd_private'; //

export interface EnvironmentServer {
  host?: string;
  port?: string;
  path?: string;
  wsPort?: string;
  wsPath?: string;
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

const fetchEnv = async (): Promise<Environment> => {
  const response = await fetch('assets/config/environment.json');
  const environment: Environment = (await response.json()) as Environment;

  env.setEnv(environment);

  return environment;
};

const envPromise: Promise<Environment> = fetchEnv();

export async function getEnvironment(): Promise<Environment> {
  await envPromise;

  return env;
}

// for autotests
Object.assign(window, { env });
