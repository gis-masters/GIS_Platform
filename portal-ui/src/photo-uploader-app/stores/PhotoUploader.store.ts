import { action, computed, makeObservable, observable } from 'mobx';
import { currentUser } from '../../app/stores/CurrentUser.store';

export enum PhotoUploaderScreens {
  AUTH,
  MAIN
}

class PhotoUploaderStore {
  @observable private _currentScreen: PhotoUploaderScreens = PhotoUploaderScreens.MAIN;

  private static _instance: PhotoUploaderStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
  }

  @computed
  get currentScreen(): PhotoUploaderScreens {
    return currentUser.name ? this._currentScreen : PhotoUploaderScreens.AUTH;
  }

  @action
  setCurrentScreen(screen: PhotoUploaderScreens) {
    this._currentScreen = screen;
  }
}

export const photoUploaderStore = PhotoUploaderStore.instance;
