import { action, computed, makeObservable, observable } from 'mobx';
import { currentUser } from '../../app/stores/CurrentUser.store';
import { UploadedFile } from '../components/UpPreviewer/Item/UpPreviewer-Item';

export enum PhotoUploaderScreens {
  AUTH,
  MAIN
}

class PhotoUploaderStore {
  @observable private _currentScreen: PhotoUploaderScreens = PhotoUploaderScreens.MAIN;
  @observable files: UploadedFile[] = [];
  @observable busy: boolean = false;
  @observable errors?: string;

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
  setCurrentScreen(screen: PhotoUploaderScreens): void {
    this._currentScreen = screen;
  }

  @action
  addUploadedFiles(files: UploadedFile[]): void {
    this.files = [...this.files, ...files];
  }

  @action
  clearUploadedFiles(): void {
    this.files = [];
  }

  @action
  setBusy(busy: boolean) {
    this.busy = busy;
  }
}

export const photoUploaderStore = PhotoUploaderStore.instance;
