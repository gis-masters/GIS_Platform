import { debounce } from 'lodash';

import { serverProperties } from '../server-properties.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { usersList } from '../../stores/UsersList.store';
import { BuildInRole } from './permissions.service';
import { PageableResponse } from '../models';
import { services } from '../services';
import { http } from '../http.service';

export interface ApiLink {
  href: string;
  templated: boolean;
}

export interface CrgUser {
  id: number;
  email: string;
  name: string;
  surName: string;
  username: string;
  enabled: boolean;
  authorities: { authority: string }[];
  createdAt: string;
  _links?: { [key: string]: ApiLink }[];
}

export interface NewUserData extends Pick<CrgUser, 'email' | 'name' | 'surName'> {
  password: string;
}

export interface UserInfo {
  userName: string;
  orgName: string;
  orgId: number;
  roles?: BuildInRole[];
}

class UsersService {
  private static _instance: UsersService;
  private usersListStoreInited = false;
  private debouncedFetchUsersListStore: () => Promise<void>;
  private currentUserInfoRequest?: Promise<void>;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchCurrent() {
    if (currentUser.userName) {
      return;
    }

    if (!this.currentUserInfoRequest) {
      this.currentUserInfoRequest = this.fetchingCurrent();
    }

    await this.currentUserInfoRequest;
    delete this.currentUserInfoRequest;
  }

  dropCurrent() {
    delete this.currentUserInfoRequest;
    currentUser.drop();
  }

  async getAll(): Promise<CrgUser[]> {
    await services.provided;
    const url = await serverProperties.usersUrl;
    const params = { size: '10000' };

    return (await http.get<PageableResponse<{ users: CrgUser[] }>>(url, { params }))._embedded.users;
  }

  async create(userData: NewUserData) {
    await services.provided;
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

    this.usersListStoreInited = true;

    await this.fetchUsersListStore();
  }

  private async fetchingCurrent(): Promise<void> {
    const url = (await serverProperties.usersUrl) + '/current';
    try {
      currentUser.setUser(await http.get<UserInfo>(url));
    } catch (e) {
      currentUser.setUser();
    }
  }

  private async fetchUsersListStore() {
    if (!this.usersListStoreInited) {
      return;
    }

    if (usersList.fetching) {
      this.debouncedFetchUsersListStore();
      return;
    }

    usersList.setFetching(true);
    const users = (await this.getAll()).filter(user => user.username !== currentUser.userName);
    usersList.setList(users);
    usersList.setFetching(false);
  }
}

export const usersService = UsersService.instance;
