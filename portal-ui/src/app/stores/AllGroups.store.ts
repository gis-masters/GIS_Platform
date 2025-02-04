import { action, makeObservable, observable } from 'mobx';

import { CrgGroup } from '../services/auth/groups/groups.models';

class AllGroups {
  private static _instance: AllGroups;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable fetching = false;
  @observable list: CrgGroup[] = [];

  private constructor() {
    makeObservable(this);
  }

  @action
  setList(list: CrgGroup[]) {
    this.list = list;
  }

  @action
  setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  reset() {
    this.setList([]);
    this.setFetching(false);
  }
}

export const allGroups = AllGroups.instance;
