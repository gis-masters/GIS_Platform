import { action, makeObservable, observable } from 'mobx';

import { CrgProject } from '../services/gis/projects/projects.models';

export const FOLDER_PARAM = 'projectFolderId';

class CurrentProjectFolderStore {
  private static _instance: CurrentProjectFolderStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable currentFolder: CrgProject | null = null;

  private constructor() {
    makeObservable(this);
  }

  @action
  setCurrentFolder(currentFolder: CrgProject | null) {
    this.currentFolder = currentFolder;

    const url = new URL(window.location.href);

    if (currentFolder) {
      url.searchParams.set(FOLDER_PARAM, currentFolder.id.toString());
    } else {
      url.searchParams.delete(FOLDER_PARAM);
    }

    window.history.pushState({}, '', url);
  }

  getSavedFolderId(): number | null {
    const url = new URL(window.location.href);
    const folderId = url.searchParams.get(FOLDER_PARAM);

    return folderId ? Number.parseInt(folderId, 10) : null;
  }
}

export const currentProjectFolderStore = CurrentProjectFolderStore.instance;
