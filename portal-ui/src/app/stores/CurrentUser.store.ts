import { observable, computed, action } from 'mobx';

import { UserInfo } from '../services/crg/users.service';
import { BuildInRole } from '../services/crg/permissions.service';

const emptyUser = {
  userName: '',
  orgName: '',
  orgId: 0,
  roles: []
};

class CurrentUser implements UserInfo {
  private static _instance: CurrentUser;

  @observable userName: string;
  @observable orgName: string;
  @observable orgId: number;
  @observable roles: BuildInRole[];

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    Object.assign(this, emptyUser);
  }

  @action
  setUser(user?: UserInfo) {
    Object.assign(this, emptyUser, user);
  }

  @action
  drop() {
    Object.assign(this, emptyUser);
  }

  @computed
  get isAdmin(): boolean {
    return this.roles.includes(BuildInRole.ORG_ADMIN) || this.roles.includes(BuildInRole.GLOBAL_ADMIN);
  }
}

export const currentUser = CurrentUser.instance;
