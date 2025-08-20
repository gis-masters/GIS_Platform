import { action, makeObservable, observable } from 'mobx';

import { CrgUser } from '../services/auth/users/users.models';

class AllUsers {
  private static _instance: AllUsers;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable fetching = false;
  @observable list: CrgUser[] = [];

  private constructor() {
    makeObservable(this);
  }

  @action
  setList(list: CrgUser[]) {
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

export const allUsers = AllUsers.instance;
