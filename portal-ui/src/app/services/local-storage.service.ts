import { StorageKeys } from './storage-keys';
import { UserInfoModel } from './crg/users.service';

class LocalStorageService {
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

  clearProject(): void {
    this.clearByKey(StorageKeys.projectKey);
  }

  getOrgId(): number | undefined {
    if (this.getUserInfo() && this.getUserInfo().orgId) {
      return this.getUserInfo().orgId;
    } else {
      console.warn('Не удалось получить orgId');
    }
  }

  saveUserModel(model: UserInfoModel) {
    this.saveByKey(StorageKeys.userModel, JSON.stringify(model));
  }

  getUserInfo(): UserInfoModel | undefined {
    const userModel = JSON.parse(this.getByKey(StorageKeys.userModel)) as UserInfoModel;
    if (!!userModel) {
      return userModel;
    } else {
      console.warn('Не удалось получить инфо о пользователе');
    }
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() { }

  private static _instance: LocalStorageService;
}

export const localStorageService = LocalStorageService.instance;
