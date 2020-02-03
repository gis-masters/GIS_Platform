import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { serverProperties } from '../server-properties.service';

export interface UserInfoModel {
  userName: string;
  orgName: string;
  orgId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpq: HttpQueue) { }

  async getInfo(): Promise<UserInfoModel> {
    return this.httpq.get<UserInfoModel>((await serverProperties.usersUrl) + '/current');
  }
}
