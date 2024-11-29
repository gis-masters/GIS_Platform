import { action, makeAutoObservable, observable } from 'mobx';

class CryptoProStore {
  @observable isPluginActive = false;

  private static _instance: CryptoProStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeAutoObservable(this);
  }

  @action
  setPluginActive() {
    this.isPluginActive = true;
  }
}

export const cryptoProStore = CryptoProStore.instance;
