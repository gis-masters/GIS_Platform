import { action, makeObservable, observable } from 'mobx';

class GlobalLoadingStore {
  private static _instance: GlobalLoadingStore;

  static get instance(): GlobalLoadingStore {
    return this._instance || (this._instance = new this());
  }

  @observable private count = 0;

  private constructor() {
    makeObservable(this);
  }

  get visible(): boolean {
    return this.count > 0;
  }

  @action
  start(): void {
    this.count++;
  }

  @action
  finish(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
}

export const globalLoadingStore = GlobalLoadingStore.instance;
