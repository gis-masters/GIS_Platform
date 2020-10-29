import { FlagsList } from './feature-flags';

export type Platform = 'conv' | 'simf';

export interface EnvironmentServer {
  host: string;
  port: number;
}

export interface Environment {
  platform: Platform;
  production: boolean;
  server: EnvironmentServer;
  ws_port: number;
  scratchWorkspaceName: string;
  flags?: FlagsList;
}

const fetchEnv = async (): Promise<Environment> => {
  const response = await fetch('assets/config/environment.json');
  const env: Environment = await response.json();

  return env;
};

const envPromise: Promise<Environment> = fetchEnv();

export function getEnvironment(): Promise<Environment> {
  return envPromise;
}
