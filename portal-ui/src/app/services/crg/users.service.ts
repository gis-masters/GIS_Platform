import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { ServerPropertiesService } from '../server-properties.service';

export interface UserInfoModel {
  userName: string;
  orgName: string;
  orgId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpq: HttpQueue,
              private serverProp: ServerPropertiesService) { }

  async getInfo(): Promise<UserInfoModel> {
    return this.httpq
               .get<UserInfoModel>((await this.serverProp.usersUrl) + '/info');
  }
}
