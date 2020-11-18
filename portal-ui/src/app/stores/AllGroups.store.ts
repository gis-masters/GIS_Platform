import { observable, action } from 'mobx';

import { CrgGroup } from '../services/crg/groups.service';

class AllGroups {
  @observable fetching = false;
  @observable list: CrgGroup[] = [];

  private static _instance: AllGroups;

  private constructor() {}

  @action setList(list: CrgGroup[]) {
    this.list = list;
  }

  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allGroups = AllGroups.instance;
