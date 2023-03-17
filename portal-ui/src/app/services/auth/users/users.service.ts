import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { allUsers } from '../../../stores/AllUsers.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { organizationSettingsService } from '../../organization-settings';
import { services } from '../../services';

import {
  _reqAllUsers,
  _reqCreateUser,
  _reqDeleteUser,
  _reqEditUser,
  _reqGetCurrentUser,
  _reqInviteUser
} from './users.client';
import { CrgUser, CrgUserRaw, NewUserData } from './users.models';

class UsersService {
  private static _instance: UsersService;
  private usersListStoreInited = false;
  private debouncedFetchUsersListStore: () => Promise<void>;
  private allUsersRequest?: Promise<void> | null;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchCurrentUser(autoLogin?: boolean) {
    try {
      const userInfo = await _reqGetCurrentUser();
      if (userInfo.id !== currentUser.id) {
        currentUser.setOrgInfo(userInfo);
      }
    } catch {
      currentUser.reset();
    }

    if (autoLogin) {
      try {
        return await _reqGetCurrentUser();
      } catch (error) {
        services.logger.error((error as AxiosError).message);
      }
    }

    await organizationSettingsService.fetch();
  }

  async getAll(): Promise<CrgUser[]> {
    const rawUsers = await _reqAllUsers();

    return rawUsers.map(this.fixAuthorities);
  }

  private fixAuthorities(user: CrgUserRaw): CrgUser {
    return {
      ...user,
      authorities: user.authorities.map(({ authority }) => authority)
    };
  }

  async getByEmail(requestedEmail: string): Promise<CrgUser | undefined> {
    await this.initUsersListStore();

    return allUsers.list.find(({ email }) => email === requestedEmail);
  }

  async invite(email: string) {
    await _reqInviteUser(email);
    void this.debouncedFetchUsersListStore();
  }

  async create(userData: NewUserData) {
    await _reqCreateUser(userData);
    void this.debouncedFetchUsersListStore();
  }

  async edit(patch: Partial<CrgUser>, id: number) {
    await _reqEditUser(patch, id);
    void this.debouncedFetchUsersListStore();
  }

  async delete(user: CrgUser) {
    await _reqDeleteUser(user.id);
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

// for autotests
if (typeof window !== undefined) {
  Object.assign(window, { usersService });
}
