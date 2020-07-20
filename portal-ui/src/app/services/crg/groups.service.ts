import { HttpParams } from '@angular/common/http';
import { debounce } from 'lodash';

import { serverProperties } from '../server-properties.service';
import { services } from '../services';
import { CrgApiResponse } from './models';
import { ApiLink, CrgUser } from './users.service';
import { groupsList } from '../../stores/GroupsList.store';

export interface CrgGroup {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  users: Pick<CrgUser, 'id' | '_links'>[];
  _links?: { [key: string]: ApiLink }[];
}

export type NewGroupData = Pick<CrgGroup, 'name' | 'description'>;

class GroupsService {
  private static _instance: GroupsService;
  private groupsListStoreInited = false;
  private debouncedFetchGroupsListStore: () => Promise<void>;

  private constructor() {
    this.debouncedFetchGroupsListStore = debounce(this.fetchGroupsListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async getAll(): Promise<CrgGroup[]> {
    await services.provided;
    const url = await serverProperties.groupsUrl;
    const params = new HttpParams().set('size', '10000');

    const response = await services.httpq.get<CrgApiResponse<{ groups: CrgGroup[] }>>(url, { params });

    return response._embedded ? response._embedded.groups : [];
  }

  async create(groupData: NewGroupData) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await services.httpq.post<CrgGroup>(url, groupData);

    this.debouncedFetchGroupsListStore();
  }

  async delete(group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await services.httpq.delete(`${url}/${group.id}`);

    this.debouncedFetchGroupsListStore();
  }

  async addUserToGroup(user: CrgUser, group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await services.httpq.post(`${url}/${group.id}/users/${user.id}`, {});

    this.debouncedFetchGroupsListStore();
  }

  async removeUserFromGroup(user: CrgUser, group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await services.httpq.delete(`${url}/${group.id}/users/${user.id}`);

    this.debouncedFetchGroupsListStore();
  }

  async initGroupsListStore() {
    if (this.groupsListStoreInited) {
      return;
    }

    this.groupsListStoreInited = true;

    await this.fetchGroupsListStore();
  }

  private async fetchGroupsListStore() {
    if (!this.groupsListStoreInited) {
      return;
    }

    if (groupsList.fetching) {
      this.debouncedFetchGroupsListStore();
      return;
    }

    groupsList.setFetching(true);
    const groups = await groupsService.getAll();
    groupsList.setList(groups);
    groupsList.setFetching(false);
  }
}

export const groupsService = GroupsService.instance;
