import { AxiosError } from 'axios';
import { debounce, DebouncedFunc } from 'lodash';

import { allUsers } from '../../../stores/AllUsers.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { PageOptions } from '../../models';
import { services } from '../../services';
import { organizationsService } from '../organizations/organizations.service';
import { usersClient } from './users.client';
import { CrgUser, CrgUserRaw, NewUserData } from './users.models';

class UsersService {
  private static _instance: UsersService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private usersListStoreInited = false;
  private allUsersRequest?: Promise<void> | null;

  readonly debouncedFetchUsersListStore: DebouncedFunc<() => Promise<void>>;

  private constructor() {
    this.debouncedFetchUsersListStore = debounce(this.fetchUsersListStore, 300);
  }

  async fetchCurrentUser(autoLogin?: boolean) {
    try {
      const userInfo = await usersClient.getCurrentUser();
      if (userInfo.id !== currentUser.id) {
        currentUser.setOrgInfo(userInfo);
      }
    } catch {
      currentUser.reset();
    }

    if (autoLogin) {
      try {
        return await usersClient.getCurrentUser();
      } catch (error) {
        services.logger.error((error as AxiosError).message);
      }
    }

    await organizationsService.loadSettings();
  }

  async updateUserOrgInfo() {
    try {
      const userInfo = await usersClient.getCurrentUser();

      if (userInfo) {
        currentUser.setOrgInfo(userInfo);
      }
    } catch {
      currentUser.reset();
    }
  }

  async getAll(): Promise<CrgUser[]> {
    const rawUsers = await usersClient.getAllUsers();

    return rawUsers.map(this.fixAuthorities);
  }

  async getUser(id: number): Promise<CrgUser> {
    return this.fixAuthorities(await usersClient.getUser(id));
  }

  async getUsers(pageOptions: PageOptions): Promise<[CrgUser[], number]> {
    const rawUsers = await usersClient.getUsers(pageOptions);

    return [rawUsers.content?.map(this.fixAuthorities) || [], rawUsers.page.totalPages];
  }

  private fixAuthorities(user: CrgUserRaw): CrgUser {
    return {
      ...user,
      authorities: user.authorities.map(({ authority }) => authority)
    };
  }

  async invite(email: string) {
    await usersClient.inviteUser(email);
    void this.debouncedFetchUsersListStore();
  }

  async create(userData: NewUserData) {
    await usersClient.createUser(userData);
    void this.debouncedFetchUsersListStore();
  }

  async edit(patch: Partial<CrgUser>, id: number) {
    await usersClient.editUser(patch, id);
    void this.debouncedFetchUsersListStore();
  }

  async delete(user: CrgUser) {
    await usersClient.deleteUser(user.id);
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
if (typeof window !== 'undefined') {
  Object.assign(window, { usersService });
}
