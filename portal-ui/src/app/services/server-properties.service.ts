import {Injectable} from '@angular/core';

import { getEnvironment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ServerPropertiesService {
  private waiting: Promise<void>;
  private _host: string;
  private _port: number;
  private _wsPort: number;
  private _baseUrl: string;
  private _geoServerUrl: string;
  private _authServerUrl: string;
  private _organizationsUrl: string;
  private _usersUrl: string;
  private _schemaUrl: string;
  private _exportUrl: string;
  private _wsUrl: string;

  get host(): Promise<string> {
    return this.getEnv().then(() => {
      return this._host;
    });
  }

  get port(): Promise<number> {
    return this.getEnv().then(() => {
      return this._port;
    });
  }

  get wsPort(): Promise<number> {
    return this.getEnv().then(() => {
      return this._wsPort;
    });
  }

  get baseUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._baseUrl;
    });
  }

  /**
   * http://localhost:8080/geoserver
   */
  get geoServerUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._geoServerUrl;
    });
  }

  get authServerUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._authServerUrl;
    });
  }

  get organizationsUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._organizationsUrl;
    });
  }

  get schemaUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._schemaUrl;
    });
  }

  get exportUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._exportUrl;
    });
  }

  get wsUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._wsUrl;
    });
  }

  get usersUrl(): Promise<string> {
    return this.getEnv().then(() => {
      return this._usersUrl;
    });
  }

  private async waitEnv (): Promise<void> {
    const environment = await getEnvironment();

    this._host = 'http://' + environment.server.host;
    this._port = environment.server.port;
    this._wsPort = environment.ws_port;
    this._baseUrl = this._host + ':' + this._port;
    this._geoServerUrl = this._baseUrl + '/geoserver';
    this._authServerUrl = this._baseUrl + '/oauth/token';
    this._organizationsUrl = this._baseUrl + '/organizations';
    this._usersUrl = this._baseUrl + '/users';
    this._schemaUrl = this._baseUrl + '/schema';
    this._exportUrl = this._baseUrl + '/export';
    this._wsUrl = this._baseUrl + '/crg-ws-endpoint';
  }

  private getEnv (): Promise<void> {
    if (!this.waiting) {
      this.waiting = this.waitEnv();
    }

    return this.waiting;
  }
}
