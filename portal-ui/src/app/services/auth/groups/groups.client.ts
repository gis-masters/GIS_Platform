import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { CrgGroup, GroupData } from './groups.models';

@boundClass
class AuthClient extends Client {
  private static _instance: AuthClient;
  static get instance(): AuthClient {
    return this._instance || (this._instance = new this());
  }

  private getGroupsUrl(): string {
    return this.getBaseUrl() + '/groups';
  }

  private getGroupUrl(groupId: number): string {
    return `${this.getGroupsUrl()}/${groupId}`;
  }

  private getGroupUserUrl(groupId: number, userId: number): string {
    return `${this.getGroupsUrl()}/${groupId}/users/${userId}`;
  }

  async getAllGroups(): Promise<CrgGroup[]> {
    return http.getPaged<CrgGroup>(this.getGroupsUrl());
  }

  async createGroup(groupData: GroupData): Promise<CrgGroup> {
    return http.post<CrgGroup>(this.getGroupsUrl(), groupData);
  }

  async updateGroup(group: CrgGroup): Promise<CrgGroup> {
    return http.patch<CrgGroup>(this.getGroupUrl(group.id), group);
  }

  async deleteGroup(groupId: number): Promise<void> {
    return http.delete(this.getGroupUrl(groupId));
  }

  async addUserToGroup(userId: number, groupId: number): Promise<void> {
    return http.post(this.getGroupUserUrl(groupId, userId), {});
  }

  async removeUserFromGroup(userId: number, groupId: number): Promise<void> {
    return http.delete(this.getGroupUserUrl(groupId, userId));
  }
}

export const authClient = AuthClient.instance;
