import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { CrgUser, CrgUserRaw, NewUserData, OrgInfo } from './users.models';

@boundClass
class UsersClient extends Client {
  private static _instance: UsersClient;
  static get instance(): UsersClient {
    return this._instance || (this._instance = new this());
  }

  private getUsersUrl(): string {
    return this.getBaseUrl() + '/users';
  }

  private getUsersInviteUrl(): string {
    return this.getUsersUrl() + '/invite';
  }

  private getUserUrl(userId: number | string): string {
    return `${this.getUsersUrl()}/${userId}`;
  }

  async getCurrentUser(): Promise<OrgInfo> {
    return http.get<OrgInfo>(this.getUserUrl('current'));
  }

  async getUser(id: number): Promise<CrgUserRaw> {
    return await http.get<CrgUserRaw>(this.getUserUrl(id));
  }

  async getAllUsers(): Promise<CrgUserRaw[]> {
    return http.getPaged<CrgUserRaw>(this.getUsersUrl());
  }

  async getUsers(pageOptions: PageOptions): Promise<PageableResources<CrgUserRaw>> {
    return await http.get<PageableResources<CrgUserRaw>>(this.getUsersUrl(), {
      params: preparePageOptions(pageOptions, true)
    });
  }

  async inviteUser(email: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('email', email);

    return http.post(this.getUsersInviteUrl(), params.toString());
  }

  async createUser(userData: NewUserData): Promise<void> {
    return http.post(this.getUsersUrl(), userData);
  }

  async editUser(patch: Partial<CrgUser>, id: number): Promise<void> {
    return http.patch(this.getUserUrl(id), patch);
  }

  async deleteUser(id: number): Promise<void> {
    return http.delete(this.getUserUrl(id));
  }
}

export const usersClient = UsersClient.instance;
