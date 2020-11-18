import { debounce } from 'lodash';

import { http } from '../http.service';
import { services } from '../services';
import { PageableResponse } from '../models';
import { ApiLink, CrgUser } from './users.service';
import { allGroups } from '../../stores/AllGroups.store';
import { serverProperties } from '../server-properties.service';

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
    const params = { size: '10000' };
    const response = await http.get<PageableResponse<{ groups: CrgGroup[] }>>(url, { params });

    return response._embedded ? response._embedded.groups : [];
  }

  async create(groupData: NewGroupData) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await http.post<CrgGroup>(url, groupData);

    this.debouncedFetchGroupsListStore();
  }

  async delete(group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await http.delete(`${url}/${group.id}`);

    this.debouncedFetchGroupsListStore();
  }

  async addUserToGroup(user: CrgUser, group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await http.post(`${url}/${group.id}/users/${user.id}`, {});

    this.debouncedFetchGroupsListStore();
  }

  async removeUserFromGroup(user: CrgUser, group: CrgGroup) {
    await services.provided;
    const url = await serverProperties.groupsUrl;

    await http.delete(`${url}/${group.id}/users/${user.id}`);

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

    if (allGroups.fetching) {
      this.debouncedFetchGroupsListStore();
      return;
    }

    allGroups.setFetching(true);
    const groups = await groupsService.getAll();
    allGroups.setList(groups);
    allGroups.setFetching(false);
  }
}

export const groupsService = GroupsService.instance;
