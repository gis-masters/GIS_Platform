export type Platform = 'conv' | 'simf';

export interface Environment {
  platform: Platform;
  production: boolean;
  version: string;
  server: {
    host: string;
    port: number;
  };
  scratchWorkspaceName: string;
}
