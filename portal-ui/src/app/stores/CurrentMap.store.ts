import { action, computed, observable } from 'mobx';

class CurrentMap {
  @observable private loadingCount = 0;

  private static _instance: CurrentMap;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  @computed
  get isLoading(): boolean {
    return Boolean(this.loadingCount);
  }

  @action
  enrollLoadingStart() {
    this.loadingCount++;
  }

  @action
  enrollLoadingFinish() {
    this.loadingCount--;
  }
}

export const currentMap = CurrentMap.instance;
