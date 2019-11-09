import { observable, computed, action } from 'mobx';

import {
  ImportTaskFull,
  ImportTaskShort,
  ImportTask,
  ImportTaskProgress,
  ScratchImport,
} from '../services/geoserver/import/models';

export interface ImportInfo {
  file?: File;
  scratch?: ScratchImport;
  fullTasks?: {[key: number]:ImportTaskFull};
  progress?: ImportTaskProgress;
  error?: boolean;
}

interface ImportTaskExtended extends ImportTask {
  isError: boolean;
  isPending: boolean;
  statusText: string;
}

const taskStatusesList: {[key: string]: string} = {
  PENDING: 'PENDING',
  READY: 'Подготовка',
  RUNNING: 'RUNNING',
  NO_CRS: 'Не определена проекция',
  NO_BOUNDS: 'NO_BOUNDS',
  NO_FORMAT: 'NO_FORMAT',
  BAD_FORMAT: 'BAD_FORMAT',
  ERROR: 'ERROR',
  CANCELED: 'CANCELED',
  COMPLETE: 'Завершен'
};

const taskErrorCodes = [
  'NO_CRS',
  'NO_BOUNDS',
  'NO_FORMAT',
  'BAD_FORMAT',
  'ERROR',
  'CANCELED'
];

const taskPendingCodes = [
  'PENDING',
  'READY',
  'RUNNING'
];

class CurrentImport implements ImportInfo {
  @observable file?: File;
  @observable scratch?: ScratchImport;
  @observable fullTasks: {[key: number]:ImportTaskFull} = {};
  @observable progress?: ImportTaskProgress;
  @observable error?: boolean;

  private defaultValues: ImportInfo = {
    file: undefined,
    scratch: undefined,
    fullTasks: {},
    progress: undefined,
    error: false
  };

  @computed
  get id (): string | null {
    if (this.scratch) {
      return String(this.scratch.id);
    } else {
      return null;
    }
  }

  @computed
  get on (): boolean {
    return this.id !== null || Boolean(this.file);
  }

  @computed
  get isError (): boolean {
    const { scratch } = this;

    return this.error || this.isWrongExt || (scratch && scratch.state === 'ERROR');
  }

  @computed
  get tasks (): ImportTaskExtended[] {
    return (this.scratch && this.scratch.tasks || []).map(task => {
      const fullTask = this.fullTasks[task.id];

      return {
        ...task,
        layer: fullTask && fullTask.layer,
        progress: fullTask && fullTask.progress,
        isError: taskErrorCodes.includes(task.state),
        isPending: taskPendingCodes.includes(task.state),
        statusText: this.getDescription(task)
      };
    });
  }

  @computed
  get notFullfilledTasks (): ImportTaskShort[] {
    return (this.scratch && this.scratch.tasks || []).filter(t => this.fullTasks[t.id]);
  }

  @computed
  get isWrongExt (): boolean {
    if (!this.file) return false;
    return this.file.name.split('.')[1] !== 'zip';
  }

  @computed
  get isFinished (): boolean {
    const { scratch } = this;
    const hasPendingTasks = this.tasks.some(t => t.isPending);
    const state = scratch && scratch.state;

    return this.on && (state === 'COMPLETE' || this.isError || !hasPendingTasks && Boolean(this.tasks.length));
  }

  @computed
  get isSuccess (): boolean {
    const hasErrorTasks = this.tasks.some(t => t.isError);

    return this.isFinished && !this.isError && this.tasks.length && !hasErrorTasks;
  }

  @action
  reset (newImport?: ImportInfo) {
    Object.assign(this, this.defaultValues, newImport || {});
  }

  @action
  fit (partialImportInfo: ImportInfo) {
    Object.assign(this, partialImportInfo);
  }

  @action
  setError (err: any) {
    this.error = true;
    // TODO отобразить бы error
  }

  @action
  setFullTasks (tasks: ImportTaskFull[]) {
    tasks.forEach(t => {
      this.fullTasks[t.id] = t;
    });
  }

  @action
  setProgress (progress: ImportTaskProgress) {
    this.progress = progress;
  }

  private getDescription(task: ImportTask): string {
    const {state} = task;
    if (Object.keys(taskStatusesList).includes(state)) {
      return taskStatusesList[state];
    } else {
      return 'Неопределенный статус';
    }
  }

  private static _instance: CurrentImport;

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const currentImport = CurrentImport.instance;
