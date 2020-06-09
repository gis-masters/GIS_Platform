import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverProperties } from '../server-properties.service';
import { services } from '../services';
import { BuildInRole } from '../util/permissions';
import { CrgApiResponse } from './models';

export interface CrgUser {
  email: string;
  username: string;
  enabled: boolean;
  surName?: string;
  authorities: string[];
  createdAt: string;
  name: string;
  id: number;
}

export interface UserInfoModel {
  userName: string;
  orgName: string;
  orgId: number;
  roles?: BuildInRole[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private static _instance: UsersService;

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  async getInfo(): Promise<UserInfoModel> {
    await services.provided;
    const url = await serverProperties.usersUrl + '/current';

    return await services.httpq.get<UserInfoModel>(url);
  }

  async getAll(): Promise<CrgApiResponse> {
    await services.provided;
    const url = await serverProperties.usersUrl;
    const params = new HttpParams().set('size', '1000');

    return await services.httpq.get<CrgApiResponse>(url, {params});
  }
}

export const usersService = UsersService.instance;
