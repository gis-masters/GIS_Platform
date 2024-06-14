import { action, computed, makeObservable, observable } from 'mobx';

import { FileInfo } from '../../services/data/files/files.models';
import { LibraryRecord } from '../../services/data/library/library.models';
import { Projection } from '../../services/data/projections/projections.models';
import { CrgProject } from '../../services/gis/projects/projects.models';

export interface PlacementTask {
  id: string;
  type: 'g' | 'f';
  title: string;
  description?: string;
  status: 'PENDING' | 'DONE' | 'ERROR';
  inProgress?: boolean;
}

export class FilesPlacementReportStore {
  @observable commonProgress: boolean;
  @observable tasks: PlacementTask[];
  @observable activeStep = 0;
  @observable projection?: Projection;
  @observable files: FileInfo[] = [];
  @observable project: CrgProject;

  constructor() {
    makeObservable(this);
    this.initState();
  }

  @computed
  get nextStepDisabled(): boolean {
    if (this.activeStep === 0) {
      return !this.projection;
    }

    if (this.activeStep === 1) {
      return this.files.length < 1;
    }

    if (this.activeStep === 2) {
      return !this.project;
    }

    if (this.activeStep === 3) {
      return this.commonProgress;
    }

    return false;
  }

  @action
  initTasks(document: LibraryRecord): void {
    this.setCommonProgress(true);

    if (this.files.length > 1) {
      this.tasks.push({
        title: document.title,
        status: 'PENDING',
        description: 'Создание группы',
        type: 'g',
        id: document.title
      });
    }

    this.files.forEach(file => {
      this.tasks.push({ title: file.title, status: 'PENDING', description: 'Создание слоя', type: 'f', id: file.id });
    });

    this.tasks[0].inProgress = true;
  }

  @action
  clear(): void {
    this.setCommonProgress(false);
    this.tasks = [];
  }

  @action
  completeTask(taskId: string, description?: string): void {
    const task = this.findTaskById(taskId);
    if (task) {
      task.status = 'DONE';
      task.inProgress = false;
      task.description = description || this.makeDefaultSuccessDescription(task);
    }
  }

  @action
  errorTask(taskId: string, errorDescription?: string): void {
    const task = this.findTaskById(taskId);
    if (task) {
      task.status = 'ERROR';
      task.inProgress = false;
      task.description = errorDescription || this.makeDefaultErrorDescription(task);
    }
  }

  @action
  runTask(taskId: string): void {
    const task = this.findTaskById(taskId);
    if (task) {
      task.inProgress = true;
    }
  }

  @action
  private initState(): void {
    this.setCommonProgress(false);
    this.tasks = [];
  }

  @action
  setCommonProgress(inProgress: boolean): void {
    this.commonProgress = inProgress;
  }

  @action
  setStep(step: number): void {
    this.activeStep = step;
  }

  @action
  nextStep(): void {
    this.activeStep++;
  }

  @action
  prevStep(): void {
    this.activeStep--;
    if (this.activeStep < 0) {
      this.activeStep = 0;
    }
  }

  @action
  setProject(project?: CrgProject): void {
    this.project = project;
  }

  @action
  setFiles(files: FileInfo[]): void {
    this.files = files;
  }

  @action.bound
  setProjection(projection?: Projection): void {
    this.projection = projection;
  }

  private findTaskById(taskId: string) {
    return this.tasks.find(task => task.id === taskId);
  }

  private makeDefaultSuccessDescription(task: PlacementTask) {
    return task.type === 'g' ? 'Группа успешно создана' : 'Слой успешно создан';
  }

  private makeDefaultErrorDescription(task: PlacementTask) {
    return `Не удалось создать ${task.type === 'g' ? 'группу: ' : 'слой: '} '${task.title}'`;
  }
}
