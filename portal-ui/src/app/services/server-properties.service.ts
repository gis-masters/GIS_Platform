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
  private _rulesUrl = this._baseUrl + '/fgistp/rules';
  private _validationUrl = this._baseUrl + '/fgistp/validation';
  private _initValidationUrl = this._validationUrl + '/init';
  private _validationInfo = this._validationUrl + '/info';
  private _exportGmlUrl = this._baseUrl + '/fgistp/export/gml';
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

  get initValidationUrl(): string {
    return this._initValidationUrl;
  }

  get validationUrl(): string {
    return this._validationUrl;
  }

  get validationInfo(): string {
    return this._validationInfo;
  }

  get exportGmlUrl(): string {
    return this._exportGmlUrl;
  }

  get wsUrl(): string {
    return this._wsUrl;
  }

}
