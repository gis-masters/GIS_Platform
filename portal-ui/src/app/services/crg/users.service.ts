import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { allUsers } from '../../stores/AllUsers.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getUsersUrl, getUserUrl } from '../server-urls.service';
import { communicationService } from '../communication.service';
import { BuildInRole } from './permissions.models';
import { PageableResponse } from '../models';
import { http } from '../http.service';
import { services } from '../services';
import { organizationSettingsService } from '../organization-settings';

export interface ApiLink {
  href: string;
  templated: boolean;
}

export interface CrgUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  middleName?: string;
  job?: string;
  department?: string;
  phone?: string;
  login: string;
  enabled: boolean;
  authorities: BuildInRole[];
  createdAt: string;
  password?: string;
  _links?: { [key: string]: ApiLink }[];
}

export type NewUserData = Pick<
  CrgUser,
  'email' | 'name' | 'surname' | 'middleName' | 'job' | 'department' | 'phone' | 'password' | 'enabled'
>;

export interface OrgInfo extends CrgUser {
  orgName: string;
  orgId: number;
}

class UsersService {
  private static _instance: UsersService;
  private usersListStoreInited = false;
  private debouncedFetchUsersListStore: () => Promise<void>;
  private allUsersRequest?: Promise<void> | null;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);

    communicationService.logout.on(() => {
      allUsers.reset();
      currentUser.reset();
      this.usersListStoreInited = false;
      delete this.allUsersRequest;
    });
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchCurrentUser(autoLogin?: boolean) {
    try {
      const userInfo = await http.get<OrgInfo>(await getUserUrl('current'));
      if (userInfo.id !== currentUser.id) currentUser.setOrgInfo(userInfo);
    } catch {
      currentUser.setOrgInfo();
    }

    if (autoLogin) {
      try {
        return await http.get<OrgInfo>(await getUserUrl('current'));
      } catch (error) {
        services.logger.error((error as AxiosError).message);
      }
    }

    await organizationSettingsService.fetch();
  }

  async getAll(): Promise<CrgUser[]> {
    const params = { size: '10000' };
    const response = await http.get<PageableResponse<CrgUser>>(await getUsersUrl(), { params });

    return response._embedded.users;
  }

  async create(userData: NewUserData) {
    await http.post(await getUsersUrl(), userData);
    void this.debouncedFetchUsersListStore();
  }

  async edit(patch: Partial<CrgUser>, id: number) {
    await http.patch(await getUserUrl(id), patch);
    void this.debouncedFetchUsersListStore();
  }

  async delete(user: CrgUser) {
    await http.delete(await getUserUrl(user.id));
    void this.debouncedFetchUsersListStore();
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

  private async fetchUsersListStore() {
    if (allUsers.fetching) {
      void this.debouncedFetchUsersListStore();

      return;
    }

    allUsers.setFetching(true);
    const users = await this.getAll();
    allUsers.setList(users);
    allUsers.setFetching(false);
  }
}

export const usersService = UsersService.instance;
