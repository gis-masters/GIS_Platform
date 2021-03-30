import { debounce } from 'lodash';

import { allUsers } from '../../stores/AllUsers.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getUsersUrl, getUserUrl } from '../server-urls.service';
import { communicationService } from '../communication.service';
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
  private allUsersRequest?: Promise<void> | null;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);

    communicationService.logout.on(() => {
      allUsers.reset();
      currentUser.reset();
      this.usersListStoreInited = false;
      delete this.currentUserInfoRequest;
      delete this.allUsersRequest;
    });
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

  async getAll(): Promise<CrgUser[]> {
    const params = { size: '10000' };

    return (await http.get<PageableResponse<{ users: CrgUser[] }>>(await getUsersUrl(), { params }))._embedded.users;
  }

  async create(userData: NewUserData) {
    await http.post(await getUsersUrl(), userData);
    this.debouncedFetchUsersListStore();
  }

  async delete(user: CrgUser) {
    await http.delete(await getUserUrl(user.id));
    this.debouncedFetchUsersListStore();
  }

  async initUsersListStore() {
    if (this.usersListStoreInited) {
      return;
    }
    if (!this.allUsersRequest) {
      this.allUsersRequest = this.fetchUsersListStore();
    }
    await this.allUsersRequest;
    this.allUsersRequest = null;
    this.usersListStoreInited = true;
  }

  async getCurrentUser(): Promise<CrgUser> {
    await this.fetchCurrentUser();

    return currentUser;
  }

  private async fetchingCurrent(): Promise<void> {
    try {
      currentUser.setOrgInfo(await http.get<OrgInfo>(await getUserUrl('current')));
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
