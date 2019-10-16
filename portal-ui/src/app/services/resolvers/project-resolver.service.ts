import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {UserInfoModel, UsersService} from '../crg/users.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationInfoResolver implements Resolve<any> {

  constructor(private usersService: UsersService) {}

  /**
   * Сходим за инфой пользователя/организации перед загрузкой старницы с проектами.
   */
  resolve(): Promise<UserInfoModel> {
    return this.usersService.getInfo();
  }

}
