import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { usersService, UserInfoModel } from '../crg/users.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationInfoResolver implements Resolve<any> {
  /**
   * Сходим за инфой пользователя/организации перед загрузкой старницы с проектами.
   */
  resolve(): Promise<UserInfoModel> {
    return usersService.getCurrentUserInfo();
  }
}
