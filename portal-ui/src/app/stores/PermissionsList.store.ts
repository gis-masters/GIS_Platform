import { observable, action } from 'mobx';

import { PermissionsListItem } from '../services/crg/permissionsList.service';

class PermissionsList {
  @observable fetching = false;
  @observable list: PermissionsListItem[] = [];

  private static _instance: PermissionsList;

  private constructor() {}

  @action setList(list: PermissionsListItem[]) {
    this.list = list;
  }
  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const permissionsList = PermissionsList.instance;
