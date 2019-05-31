import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
  }

  getInfo(): Observable<UserInfoModel> {
    return this.http
               .get<UserInfoModel>(this.serverProp.usersUrl + '/info');
  }

}

export interface UserInfoModel {
  userName: string;
  orgName: string;
  orgId: number;
}
