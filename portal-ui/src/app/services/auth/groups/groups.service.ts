import { debounce, DebouncedFunc } from 'lodash';

import { allGroups } from '../../../stores/AllGroups.store';
import { CrgUser } from '../users/users.models';
import { authClient } from './groups.client';
import { CrgGroup, GroupData } from './groups.models';

class GroupsService {
  private static _instance: GroupsService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private allGroupsStoreInited = false;
  private allGroupsFetching?: Promise<CrgGroup[]>;

  readonly debouncedFetchGroupsListStore: DebouncedFunc<() => Promise<void>>;

  private constructor() {
    this.debouncedFetchGroupsListStore = debounce(this.fetchGroupsListStore, 300);
  }

  async getAll(): Promise<CrgGroup[]> {
    return await authClient.getAllGroups();
  }

  async create(groupData: GroupData) {
    await authClient.createGroup(groupData);
    void this.debouncedFetchGroupsListStore();
  }

  async update(group: CrgGroup) {
    await authClient.updateGroup(group);
    void this.debouncedFetchGroupsListStore();
  }

  async delete(group: CrgGroup) {
    await authClient.deleteGroup(group.id);
    void this.debouncedFetchGroupsListStore();
  }

  async getUserGroups(user: CrgUser): Promise<CrgGroup[]> {
    await this.initAllGroupsStore();

    return allGroups.list.filter(({ users }) => users.some(({ id }) => id === user.id));
  }

  async addUserToGroup(user: CrgUser, group: CrgGroup) {
    await authClient.addUserToGroup(user.id, group.id);
    void this.debouncedFetchGroupsListStore();
  }

  async removeUserFromGroup(user: CrgUser, group: CrgGroup) {
    await authClient.removeUserFromGroup(user.id, group.id);
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
