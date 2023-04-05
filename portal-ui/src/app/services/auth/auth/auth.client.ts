import { http } from '../../api/http.service';
import {
  getAuthUrl,
  getChangePasswordUrl,
  getLogoutUrl,
  getOrganizationsUrl,
  getRestorePasswordUrl
} from '../../api/server-urls.service';
import { Mime } from '../../util/Mime';
import { AuthCredentials, OrganizationsListItemInfo, RegData } from './auth.models';

export async function _reqAuthenticate(credentials: AuthCredentials): Promise<string | OrganizationsListItemInfo[]> {
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

  return http.post<string | OrganizationsListItemInfo[]>(await getAuthUrl(), params.toString(), options);
}

export async function _reqLogout(): Promise<void> {
  return http.post(await getLogoutUrl(), {}, { withCredentials: true });
}

export async function _reqRegistration(regData: RegData): Promise<void> {
  const url = await getOrganizationsUrl();
  const payload = {
    name: regData.company,
    phone: regData.contactPhone,
    owner: {
      name: regData.firstName,
      surname: regData.lastName,
      email: regData.email,
      password: regData.password
    }
  };

  return http.post(url + '/init', payload);
}

export async function _reqRestorePassword(email: string, origin: string): Promise<void> {
  const url = await getRestorePasswordUrl();

  return http.post(url, { email, origin });
}

export async function _reqChangePassword(token: string, password?: string): Promise<void> {
  const url = await getChangePasswordUrl();

  return http.post(url, { token, password });
}
