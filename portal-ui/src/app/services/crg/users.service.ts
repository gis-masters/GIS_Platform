import { debounce } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { allUsers } from '../../stores/AllUsers.store';
import { serverProperties } from '../server-properties.service';
import { BuildInRole } from './permissions.models';
import { PageableResponse } from '../models';
import { http } from '../http.service';

export interface ApiLink {
  href: string;
  templated: boolean;
}

export interface CrgUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  login: string;
  enabled: boolean;
  authorities: BuildInRole[];
  createdAt: string;
  _links?: { [key: string]: ApiLink }[];
}

export interface NewUserData extends Pick<CrgUser, 'email' | 'name' | 'surname'> {
  password: string;
}

export interface OrgInfo extends CrgUser {
  orgName: string;
  orgId: number;
}

class UsersService {
  private static _instance: UsersService;
  private usersListStoreInited = false;
  private debouncedFetchUsersListStore: () => Promise<void>;
  private currentUserInfoRequest?: Promise<void> | null;
  private usersListRequest?: Promise<void> | null;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchCurrentUser() {
    if (currentUser.login) {
      return;
    }

    if (!this.currentUserInfoRequest) {
      this.currentUserInfoRequest = this.fetchingCurrent();
    }

    await this.currentUserInfoRequest;
    this.currentUserInfoRequest = null;
  }

  dropCurrent() {
    this.currentUserInfoRequest = null;
    currentUser.drop();
  }

  async getAll(): Promise<CrgUser[]> {
    const url = await serverProperties.usersUrl;
    const params = { size: '10000' };

    return (await http.get<PageableResponse<{ users: CrgUser[] }>>(url, { params }))._embedded.users;
  }

  async create(userData: NewUserData) {
    const url = await serverProperties.usersUrl;

    await http.post(url, userData);

    this.debouncedFetchUsersListStore();
  }

  async delete(user: CrgUser) {
    const url = await serverProperties.usersUrl;

    await http.delete(`${url}/${user.id}`);

    this.debouncedFetchUsersListStore();
  }

  async initUsersListStore() {
    if (this.usersListStoreInited) {
      return;
    }
    if (!this.usersListRequest) {
      this.usersListRequest = this.fetchUsersListStore();
    }
    await this.usersListRequest;
    this.usersListRequest = null;
    this.usersListStoreInited = true;
  }

  async getCurrentUser(): Promise<CrgUser> {
    await this.fetchCurrentUser();

    return currentUser;
  }

  private async fetchingCurrent(): Promise<void> {
    const url = (await serverProperties.usersUrl) + '/current';
    try {
      currentUser.setOrgInfo(await http.get<OrgInfo>(url));
    } catch (e) {
      currentUser.setOrgInfo();
    }
  }

  private async fetchUsersListStore() {
    if (allUsers.fetching) {
      this.debouncedFetchUsersListStore();
      return;
    }

    allUsers.setFetching(true);
    const users = await this.getAll();
    allUsers.setList(users);
    allUsers.setFetching(false);
  }
}

export const usersService = UsersService.instance;
