import { env } from '../stores/Env.store';
import { FlagsList } from './feature-flags';

export type Platform = 'conv' | 'simf';

export interface EnvironmentServer {
  host?: string;
  port?: string;
  path?: string;
  wsPort?: string;
  wsPath?: string;
}

export interface Environment {
  platform: Platform;
  production: boolean;
  server: EnvironmentServer;
  scratchWorkspaceName: string;
  flags?: FlagsList;
  logo?: string;
  favicon?: string;
}

const fetchEnv = async (): Promise<Environment> => {
  const response = await fetch('assets/config/environment.json');
  const environment: Environment = await response.json();

  env.setEnv(environment);

  return environment;
};

const envPromise: Promise<Environment> = fetchEnv();

export function getEnvironment(): Promise<Environment> {
  return envPromise;
}
