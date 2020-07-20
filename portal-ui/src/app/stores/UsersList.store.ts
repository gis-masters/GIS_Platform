import { observable, action } from 'mobx';

import { CrgUser } from '../services/crg/users.service';

class UsersList {
  @observable fetching = false;
  @observable list: CrgUser[] = [];

  private static _instance: UsersList;

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

export const usersList = UsersList.instance;
