import { http } from '../../http.service';
import { getUsersInviteUrl, getUsersUrl, getUserUrl } from '../../server-urls.service';

import { CrgUser, CrgUserRaw, NewUserData, OrgInfo } from './users.models';

export async function _reqGetCurrentUser(): Promise<OrgInfo> {
  return http.get<OrgInfo>(await getUserUrl('current'));
}

export async function _reqAllUsers(): Promise<CrgUserRaw[]> {
  return http.getPaged<CrgUserRaw>(await getUsersUrl());
}

export async function _reqInviteUser(email: string): Promise<void> {
  const params = new URLSearchParams();
  params.append('email', email);

  return http.post(await getUsersInviteUrl(), params.toString());
}

export async function _reqCreateUser(userData: NewUserData): Promise<void> {
  return http.post(await getUsersUrl(), userData);
}

export async function _reqEditUser(patch: Partial<CrgUser>, id: number): Promise<void> {
  return http.patch(await getUserUrl(id), patch);
}

export async function _reqDeleteUser(id: number): Promise<void> {
  return http.delete(await getUserUrl(id));
}
