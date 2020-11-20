import { observable, action } from 'mobx';

import { PermissionsListItem } from '../services/crg/allPermissions.service';

class AllPermissions {
  @observable fetching = false;
  @observable fetchingProgress?: number;
  @observable list: PermissionsListItem[] = [];

  private static _instance: AllPermissions;

  private constructor() {}

  @action setList(list: PermissionsListItem[]) {
    this.list = list;
  }

  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  @action setFetchingProgress(fetching?: number) {
    this.fetchingProgress = fetching;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allPermissions = AllPermissions.instance;
