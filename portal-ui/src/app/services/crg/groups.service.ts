import { debounce } from 'lodash';

import { allGroups } from '../../stores/AllGroups.store';
import { serverProperties } from '../server-properties.service';
import { ApiLink, CrgUser } from './users.service';
import { PageableResponse } from '../models';
import { http } from '../http.service';

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
    const url = await serverProperties.groupsUrl;
    const params = { size: '10000' };
    const response = await http.get<PageableResponse<{ groups: CrgGroup[] }>>(url, { params });

    return response._embedded ? response._embedded.groups : [];
  }

  async create(groupData: NewGroupData) {
    const url = await serverProperties.groupsUrl;

    await http.post<CrgGroup>(url, groupData);

    this.debouncedFetchGroupsListStore();
  }

  async delete(group: CrgGroup) {
    const url = await serverProperties.groupsUrl;

    await http.delete(`${url}/${group.id}`);

    this.debouncedFetchGroupsListStore();
  }

  async getUserGroups(user: CrgUser): Promise<CrgGroup[]> {
    await this.initAllGroupsStore();

    return allGroups.list.filter(({ users }) => users.some(({ id }) => id === user.id));
  }

  async addUserToGroup(user: CrgUser, group: CrgGroup) {
    const url = await serverProperties.groupsUrl;

    await http.post(`${url}/${group.id}/users/${user.id}`, {});

    this.debouncedFetchGroupsListStore();
  }

  async removeUserFromGroup(user: CrgUser, group: CrgGroup) {
    const url = await serverProperties.groupsUrl;

    await http.delete(`${url}/${group.id}/users/${user.id}`);

    this.debouncedFetchGroupsListStore();
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
      this.debouncedFetchGroupsListStore();
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
