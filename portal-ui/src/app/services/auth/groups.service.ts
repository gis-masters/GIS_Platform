import { debounce } from 'lodash';

import { allGroups } from '../../stores/AllGroups.store';
import { getGroupsUrl, getGroupUrl, getGroupUserUrl } from '../server-urls.service';
import { ApiLink, CrgUser } from './users.service';
import { http } from '../http.service';

export interface CrgGroup {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  users: Pick<CrgUser, 'id'>[];
  _links?: { [key: string]: ApiLink }[];
}

export type GroupData = Pick<CrgGroup, 'name' | 'description'>;

class GroupsService {
  private static _instance: GroupsService;
  private allGroupsStoreInited = false;
  private debouncedFetchGroupsListStore: () => Promise<void>;
  private allGroupsFetching?: Promise<CrgGroup[]>;

  private constructor() {
    this.debouncedFetchGroupsListStore = debounce(this.fetchGroupsListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async getAll(): Promise<CrgGroup[]> {
    return await http.getPaged<CrgGroup>(await getGroupsUrl());
  }

  async create(groupData: GroupData) {
    const url = await getGroupsUrl();
    await http.post<CrgGroup>(url, groupData);
    void this.debouncedFetchGroupsListStore();
  }

  async update(groupData: CrgGroup) {
    const url = await getGroupUrl(groupData.id);
    await http.patch<CrgGroup>(url, groupData);
    void this.debouncedFetchGroupsListStore();
  }

  async delete(group: CrgGroup) {
    await http.delete(await getGroupUrl(group.id));
    void this.debouncedFetchGroupsListStore();
  }

  async getUserGroups(user: CrgUser): Promise<CrgGroup[]> {
    await this.initAllGroupsStore();

    return allGroups.list.filter(({ users }) => users.some(({ id }) => id === user.id));
  }

  async addUserToGroup(user: CrgUser, group: CrgGroup) {
    await http.post(await getGroupUserUrl(group.id, user.id), {});
    void this.debouncedFetchGroupsListStore();
  }

  async removeUserFromGroup(user: CrgUser, group: CrgGroup) {
    await http.delete(await getGroupUserUrl(group.id, user.id));
    void this.debouncedFetchGroupsListStore();
  }

  async initAllGroupsStore() {
    if (this.allGroupsStoreInited) {
      if (this.allGroupsFetching) {
        await this.allGroupsFetching;
      }

      return;
    }

    this.allGroupsStoreInited = true;

    await this.fetchGroupsListStore();
  }

  private async fetchGroupsListStore() {
    if (!this.allGroupsStoreInited) {
      return;
    }

    if (allGroups.fetching) {
      void this.debouncedFetchGroupsListStore();

      return;
    }

    allGroups.setFetching(true);
    this.allGroupsFetching = groupsService.getAll();
    const groups = await this.allGroupsFetching;
    delete this.allGroupsFetching;
    allGroups.setList(groups);
    allGroups.setFetching(false);
  }
}

export const groupsService = GroupsService.instance;
