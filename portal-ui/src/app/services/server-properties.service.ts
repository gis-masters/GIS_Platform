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

  constructor() {
  }

  get host(): string {
    return this._host;
  }

  set host(value: string) {
    this._host = value;
  }

  get port(): number {
    return this._port;
  }

  set port(value: number) {
    this._port = value;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(value: string) {
    this._baseUrl = value;
  }

  get geoServerUrl(): string {
    return this._geoServerUrl;
  }

  set geoServerUrl(value: string) {
    this._geoServerUrl = value;
  }

  get authServerUrl(): string {
    return this._authServerUrl;
  }

  set authServerUrl(value: string) {
    this._authServerUrl = value;
  }

  get organizationsUrl(): string {
    return this._organizationsUrl;
  }

  set organizationsUrl(value: string) {
    this._organizationsUrl = value;
  }

  get rulesUrl(): string {
    return this._rulesUrl;
  }

  set rulesUrl(value: string) {
    this._rulesUrl = value;
  }

  get validationUrl(): string {
    return this._validationUrl;
  }

  set validationUrl(value: string) {
    this._validationUrl = value;
  }

}
