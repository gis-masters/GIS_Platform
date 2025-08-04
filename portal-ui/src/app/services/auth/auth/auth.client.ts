import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { AuthCredentials, OrganizationsListItemInfo, RegData } from './auth.models';

@boundClass
class AuthClient extends Client {
  private static _instance: AuthClient;
  static get instance(): AuthClient {
    return this._instance || (this._instance = new this());
  }

  private getAuthUrl(): string {
    return this.getBaseUrl() + '/oauth/token';
  }

  private getLogoutUrl(): string {
    return this.getBaseUrl() + '/perform_logout';
  }

  private getOrganizationInitUrl(): string {
    return this.getBaseUrl() + '/organizations/init';
  }

  private getRestorePasswordUrl(): string {
    return this.getBaseUrl() + '/request-password-reset';
  }

  private getChangePasswordUrl(): string {
    return this.getBaseUrl() + '/password-reset';
  }

  async authenticate(credentials: AuthCredentials): Promise<string | OrganizationsListItemInfo[]> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');
    if (credentials.orgId) {
      params.append('orgId', String(credentials.orgId));
    }

    const headers = {
      'Content-Type': Mime.FORM_URLENCODED
    };
    const options = { withCredentials: true, isAuthenticate: true, headers };

    return http.post<string | OrganizationsListItemInfo[]>(this.getAuthUrl(), params.toString(), options);
  }

  async logout(): Promise<void> {
    return http.post(this.getLogoutUrl(), {}, { withCredentials: true });
  }

  async registration(regData: RegData): Promise<number> {
    const payload = {
      name: regData.company,
      phone: regData.contactPhone,
      description: regData.description,
      specializationId: regData.specializationId,
      owner: {
        name: regData.firstName,
        surname: regData.lastName,
        email: regData.email,
        password: regData.password
      }
    };

    return http.post<number>(this.getOrganizationInitUrl(), payload);
  }

  async restorePassword(email: string, origin: string): Promise<void> {
    return http.post(this.getRestorePasswordUrl(), { email, origin });
  }

  async changePassword(token: string, password?: string): Promise<void> {
    return http.post(this.getChangePasswordUrl(), { token, password });
  }
}

export const authClient = AuthClient.instance;
