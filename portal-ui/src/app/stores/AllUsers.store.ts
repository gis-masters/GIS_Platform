import { observable, action } from 'mobx';

import { CrgUser } from '../services/crg/users.service';

class AllUsers {
  @observable fetching = false;
  @observable list: CrgUser[] = [];

  private static _instance: AllUsers;

  private constructor() {}

  @action setList(list: CrgUser[]) {
    this.list = list;
  }
  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allUsers = AllUsers.instance;
