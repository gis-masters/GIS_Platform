import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerPropertiesService {

  private _host = 'http://' + environment.server.host;
  private _port = environment.server.port;
  private _baseUrl = this._host + ':' + this._port;

  private _geoServerUrl = this._baseUrl + '/geoserver';
  private _authServerUrl = this._baseUrl + '/oauth/token';
  private _organizationsUrl = this._baseUrl + '/organizations';
  private _usersUrl = this._baseUrl + '/users';
  private _rulesUrl = this._baseUrl + '/fgistp/rules';
  private _wsUrl = this._baseUrl + '/crg-ws-endpoint';

  constructor() {
  }

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * http://localhost:8080/geoserver
   */
  get geoServerUrl(): string {
    return this._geoServerUrl;
  }

  get authServerUrl(): string {
    return this._authServerUrl;
  }

  get organizationsUrl(): string {
    return this._organizationsUrl;
  }

  get rulesUrl(): string {
    return this._rulesUrl;
  }

  get wsUrl(): string {
    return this._wsUrl;
  }

  get usersUrl(): string {
    return this._usersUrl;
  }

  set usersUrl(value: string) {
    this._usersUrl = value;
  }

}
