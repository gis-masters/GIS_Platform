import { action, computed, makeObservable, observable } from 'mobx';

import { http } from '../../app/services/api/http.service';
import { currentUser } from '../../app/stores/CurrentUser.store';
import { UpLayersListItemData } from '../components/UpLayersList/Item/UpLayersList-Item';
import { UploadedFile, UploadedFileStatus } from '../services/photoUploader.models';
import { UploadResultType } from '../services/photoUploader.service';

export enum PhotoUploaderScreens {
  BUSY,
  AUTH,
  MAIN,
  LAYERS_LIST,
  PHOTO_LIST,
  LOADER,
  UPLOAD_RESULT
}

class PhotoUploaderStore {
  private static _instance: PhotoUploaderStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable private _currentScreen: PhotoUploaderScreens = PhotoUploaderScreens.MAIN;
  @observable previousScreen?: PhotoUploaderScreens;
  @observable files: UploadedFile[] = [];
  @observable busy: boolean = false;
  @observable errors: string[] = [];
  @observable checkedLayer: UpLayersListItemData | null = null;
  @observable searchValue: string = '';
  @observable needReturnButton: boolean = false;
  @observable returnButtonBusy: boolean = false;
  @observable canUploading: boolean = true;
  @observable uploaded: boolean = false;
  @observable uploadResult: UploadResultType | null = null;
  @observable labelValue: string = '';

  private constructor() {
    makeObservable(this);
  }

  @computed
  get currentScreen(): PhotoUploaderScreens {
    if (http.waitingForAuth) {
      return PhotoUploaderScreens.AUTH;
    }

    if (!currentUser.name) {
      return PhotoUploaderScreens.BUSY;
    }

    return this._currentScreen;
  }

  @computed
  get filesWithError(): number {
    return this.files.filter(item => !item.feature || item.status === UploadedFileStatus.ERROR).length;
  }

  @computed
  get filesSucceeded(): number {
    return this.files.filter(item => item.status === UploadedFileStatus.SUCCESS).length;
  }

  @computed
  get filesHandled(): number {
    return this.files.filter(item => item.status).length;
  }

  @computed
  get currentHeaderTitle(): string {
    let headerTitle: string;
    switch (this._currentScreen) {
      case PhotoUploaderScreens.LAYERS_LIST: {
        headerTitle = 'Выбор слоя';
        break;
      }
      case PhotoUploaderScreens.PHOTO_LIST: {
        headerTitle = 'Фотографии';
        break;
      }
      case PhotoUploaderScreens.LOADER: {
        headerTitle =
          this.files.length === this.filesHandled
            ? `Загружено (${this.filesSucceeded}/${this.files.length})`
            : `Загружаем (${this.filesHandled}/${this.files.length})`;
        break;
      }
      case PhotoUploaderScreens.UPLOAD_RESULT: {
        headerTitle = 'Готово';
        break;
      }

      default: {
        headerTitle = 'Загрузка фотографий';
      }
    }

    return headerTitle;
  }

  @action
  removeFileByTitle(title: string): void {
    this.files = this.files.filter(item => item.title !== title);
  }

  @action
  addUploadedFiles(files: UploadedFile[]): void {
    this.files = [...this.files, ...files];
  }

  @action
  updateFile(filePatch: Partial<UploadedFile>) {
    const updatingFile = this.files.find(item => item.file === filePatch.file);

    if (!updatingFile) {
      throw new Error('Отсуствует объект изменения');
    }

    Object.assign(updatingFile, filePatch);
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
  setReturnButton(): void {
    this.needReturnButton = true;
  }

  @action
  setCurrentScreen(screen: PhotoUploaderScreens): void {
    this.previousScreen = this._currentScreen;
    this._currentScreen = screen;

    this.needReturnButton = true;

    if (!this.canUploading) {
      this.canUploading = true;
    }
  }

  @action
  returnToMainScreen(): void {
    this.previousScreen = this._currentScreen;
    this._currentScreen = PhotoUploaderScreens.MAIN;

    this.needReturnButton = false;

    if (!this.canUploading) {
      this.canUploading = true;
    }
  }

  @action
  setReturnButtonBusy(busy: boolean): void {
    this.returnButtonBusy = busy;
  }

  @action
  setCanUploading(loading: boolean): void {
    this.canUploading = loading;
  }

  @action
  setUploadResult(result: UploadResultType): void {
    this.uploadResult = result;
  }

  @action
  clearUploadResult(): void {
    this.uploadResult = null;
  }

  @action.bound
  setLabelValue(value: string): void {
    this.labelValue = value;
  }
}

export const photoUploaderStore = PhotoUploaderStore.instance;
