import { action, computed, makeObservable, observable } from 'mobx';

import {
  ImportTask,
  ImportTaskFull,
  ImportTaskProgress,
  ImportTaskShort,
  ScratchImport,
  TaskStatusCode
} from '../services/geoserver/import/import.models';
import { ValueOf } from '../services/models';

export interface ImportInfo {
  file?: File;
  scratch?: ScratchImport;
  fullTasks?: { [key: number]: ImportTaskFull };
  progress?: ImportTaskProgress;
  error?: boolean;
}

export interface ImportTaskExtended extends ImportTask {
  isError: boolean;
  isPending: boolean;
  statusText: ValueOf<typeof taskStatusesList>;
}

const taskStatusesList: { [key in TaskStatusCode]: string } = {
  PENDING: 'PENDING',
  READY: 'Подготовка',
  RUNNING: 'RUNNING',
  NO_CRS: 'Не определена проекция',
  NO_BOUNDS: 'NO_BOUNDS',
  NO_FORMAT: 'NO_FORMAT',
  BAD_FORMAT: 'BAD_FORMAT',
  ERROR: 'ERROR',
  CANCELED: 'CANCELED',
  COMPLETE: 'Завершен',
  UNKNOWN: 'Неопределенный статус'
};

const taskErrorCodes: Set<TaskStatusCode> = new Set([
  TaskStatusCode.NO_CRS,
  TaskStatusCode.NO_BOUNDS,
  TaskStatusCode.NO_FORMAT,
  TaskStatusCode.BAD_FORMAT,
  TaskStatusCode.ERROR,
  TaskStatusCode.CANCELED
]);

const taskPendingCodes: Set<TaskStatusCode> = new Set([
  TaskStatusCode.PENDING,
  TaskStatusCode.READY,
  TaskStatusCode.RUNNING
]);

class CurrentImport implements ImportInfo {
  private static _instance: CurrentImport;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable file?: File;
  @observable scratch?: ScratchImport;
  @observable fullTasks: { [key: number]: ImportTaskFull } = {};
  @observable progress?: ImportTaskProgress;
  @observable error?: boolean;

  private defaultValues: ImportInfo = {
    file: undefined,
    scratch: undefined,
    fullTasks: {},
    progress: undefined,
    error: false
  };

  private constructor() {
    makeObservable(this);
  }

  @computed
  get id(): string | null {
    return this.scratch ? String(this.scratch.id) : null;
  }

  @computed
  get on(): boolean {
    return this.id !== null || Boolean(this.file);
  }

  @computed
  get isError(): boolean {
    const { scratch, error, isWrongExt } = this;

    return error || isWrongExt || scratch?.state === 'ERROR';
  }

  @computed
  get tasks(): ImportTaskExtended[] {
    return ((this.scratch && this.scratch.tasks) || []).map(task => {
      const fullTask = this.fullTasks[task.id];

      return {
        ...task,
        layer: fullTask && fullTask.layer,
        progress: fullTask && fullTask.progress,
        isError: taskErrorCodes.has(task.state),
        isPending: taskPendingCodes.has(task.state),
        statusText: this.getDescription(task)
      };
    });
  }

  @computed
  get notFulfilledTasks(): ImportTaskShort[] {
    return ((this.scratch && this.scratch.tasks) || []).filter(t => !this.fullTasks[t.id]);
  }

  @computed
  get isWrongExt(): boolean {
    if (!this.file) {
      return false;
    }

    return this.file.name.split('.')[1] !== 'zip';
  }

  @computed
  get isFinished(): boolean {
    const hasPendingTasks = this.tasks.some(t => t.isPending);
    const state = this.scratch?.state;

    return this.on && (state === 'COMPLETE' || this.isError || (!hasPendingTasks && Boolean(this.tasks.length)));
  }

  @computed
  get errorTasks(): ImportTaskExtended[] {
    return this.tasks.filter(t => t.isError);
  }

  @computed
  get hasErrorTasks(): boolean {
    return Boolean(this.errorTasks.length);
  }

  @computed
  get hasSuccessTasks(): boolean {
    return this.tasks.some(t => !t.isError);
  }

  @computed
  get isSuccess(): boolean {
    return this.isFinished && !this.isError && this.hasSuccessTasks;
  }

  @action
  reset(newImport?: ImportInfo) {
    Object.assign(this, this.defaultValues, newImport || {});
  }

  @action
  fit(partialImportInfo: ImportInfo) {
    Object.assign(this, partialImportInfo);
  }

  @action
  setError() {
    this.error = true;
    // TODO отобразить бы error
  }

  @action
  setFullTasks(tasks: ImportTaskFull[]) {
    tasks.forEach(t => {
      this.fullTasks[t.id] = t;
    });
  }

  @action
  setProgress(progress: ImportTaskProgress) {
    this.progress = progress;
  }

  private getDescription(task: ImportTask): string {
    const { state } = task;

    return Object.keys(taskStatusesList).includes(state) ? taskStatusesList[state] : 'Неопределенный статус';
  }
}

export const currentImport = CurrentImport.instance;
