import { action, computed, makeObservable, observable } from 'mobx';

import { OrgInfo } from '../services/auth/users/users.models';
import { BuiltInRole } from '../services/permissions/permissions.models';

const emptyOrgInfo: OrgInfo = {
  id: 0,
  email: '',
  name: '',
  surname: '',
  login: '',
  geoserverLogin: '',
  enabled: false,
  authorities: [],
  createdAt: '',
  orgName: '',
  orgId: 0
};

class CurrentUser implements OrgInfo {
  private static _instance: CurrentUser;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable id: number = emptyOrgInfo.id;
  @observable email: string = emptyOrgInfo.email;
  @observable name: string = emptyOrgInfo.name;
  @observable surname: string = emptyOrgInfo.surname;
  @observable login: string = emptyOrgInfo.login;
  @observable geoserverLogin: string = emptyOrgInfo.geoserverLogin;
  @observable enabled: boolean = emptyOrgInfo.enabled;
  @observable authorities: BuiltInRole[] = emptyOrgInfo.authorities;
  @observable createdAt: string = emptyOrgInfo.createdAt;
  @observable orgName: string = emptyOrgInfo.orgName;
  @observable orgId: number = emptyOrgInfo.orgId;

  private constructor() {
    makeObservable(this);
    Object.assign(this, emptyOrgInfo);
  }

  @action
  setOrgInfo(user?: OrgInfo) {
    Object.assign(this, emptyOrgInfo, user);
  }

  @action
  reset() {
    Object.assign(this, emptyOrgInfo);
  }

  @computed
  get isAdmin(): boolean {
    return this.authorities.includes(BuiltInRole.ORG_ADMIN) || this.authorities.includes(BuiltInRole.SYSTEM_ADMIN);
  }

  @computed
  get isSystemAdmin(): boolean {
    return this.authorities.includes(BuiltInRole.SYSTEM_ADMIN);
  }

  @computed
  get workspaceName(): string {
    return `scratch_database_${this.orgId}`;
  }

  @computed
  get datastoreName(): string {
    // TODO: Дичь! Надо бы разобраться...
    return `${this.workspaceName}_store`;
  }
}

export const currentUser = CurrentUser.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { currentUser });
}
