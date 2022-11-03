import { observable, computed, action, makeObservable } from 'mobx';

import { BuiltInRole } from '../services/data/permissions.models';
import { OrgInfo } from '../services/data/users.service';

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

  @observable id: number;
  @observable email: string;
  @observable name: string;
  @observable surname: string;
  @observable login: string;
  @observable geoserverLogin: string;
  @observable enabled: boolean;
  @observable authorities: BuiltInRole[];
  @observable createdAt: string;
  @observable orgName: string;
  @observable orgId: number;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

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
    return `${this.workspaceName}_store`;
  }
}

export const currentUser = CurrentUser.instance;
