import { StorageKeys } from './storage-keys';
import { UserInfo } from './crg/users.service';

class LocalStorageService {
  private static _instance: LocalStorageService;

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  cleanUp() {
    window.localStorage.clear();
  }

  saveByKey(key: string, payload: any): void {
    window.localStorage.setItem(key, payload);
  }

  getByKey(key: string): any {
    return localStorage.getItem(key);
  }

  clearByKey(key: string): any {
    return localStorage.removeItem(key);
  }

  getOrgId(): number | undefined {
    if (this.getUserInfo() && this.getUserInfo().orgId) {
      return this.getUserInfo().orgId;
    } else {
      console.warn('Не удалось получить orgId');
    }
  }

  saveUserModel(model: UserInfo) {
    this.saveByKey(StorageKeys.userModel, JSON.stringify(model));
  }

  getUserInfo(): UserInfo | undefined {
    const userModel = JSON.parse(this.getByKey(StorageKeys.userModel)) as UserInfo;
    if (!!userModel) {
      return userModel;
    } else {
      console.warn('Не удалось получить инфо о пользователе');
    }
  }
}

export const localStorageService = LocalStorageService.instance;
