import { action, computed, makeObservable, observable } from 'mobx';

import { currentUser } from '../../app/stores/CurrentUser.store';
import { UploadedFile } from '../components/UpPreviewer/Item/UpPreviewer-Item';
import { UpLayersListItemData } from '../components/UpLayersList/Item/UpLayersList-Item';

export enum PhotoUploaderScreens {
  AUTH,
  MAIN,
  PHOTOS,
  LAYERSLIST
}

class PhotoUploaderStore {
  @observable private _currentScreen: PhotoUploaderScreens = PhotoUploaderScreens.MAIN;
  @observable files: UploadedFile[] = [];
  @observable busy: boolean = false;
  @observable errors: string[] = [];
  @observable checkedLayer?: UpLayersListItemData | null = null;
  @observable searchValue: string = '';

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

  @computed
  get currentHeaderTitle(): string {
    let headerTitle: string;
    switch (this._currentScreen) {
      case PhotoUploaderScreens.LAYERSLIST: {
        headerTitle = 'Выбор слоя';
        break;
      }
      case PhotoUploaderScreens.PHOTOS: {
        headerTitle = 'Фотографии';
        break;
      }

      default: {
        headerTitle = 'Загрузка фотографий';
      }
    }

    return headerTitle;
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
  addError(errorMessage: string): void {
    this.errors.push(errorMessage);
  }

  @action
  clearUploadedFiles(): void {
    this.files = [];
  }

  @action
  setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  setCheckedLayer(checkedLayer: UpLayersListItemData | null): void {
    this.checkedLayer = checkedLayer;
  }

  @action
  setSearchValue(value: string): void {
    this.searchValue = value;
  }

  @action
  openLayersList(): void {
    this._currentScreen = PhotoUploaderScreens.LAYERSLIST;
  }

  @action
  closeLayersList(): void {
    this._currentScreen = PhotoUploaderScreens.MAIN;
  }
}

export const photoUploaderStore = PhotoUploaderStore.instance;
