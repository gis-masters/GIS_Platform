import { observable, action } from 'mobx';

import { CrgUser } from '../services/crg/users.service';
import { currentUser } from './CurrentUser.store';

class AllUsers {
  @observable fetching = false;
  @observable list: CrgUser[] = [];
  @observable fullList: CrgUser[] = [];

  private static _instance: AllUsers;

  private constructor() {}

  @action setList(list: CrgUser[]) {
    this.fullList = list;
    this.list = list.filter(user => user.username !== currentUser.userName);
  }

  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allUsers = AllUsers.instance;
