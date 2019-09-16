import {Component, Input, OnInit} from '@angular/core';
import {ImportService} from '../../services/geoserver/import/import.service';
import {ImportTaskFull, ImportTaskProgress, ImportTaskShort} from '../../services/geoserver/import/models';

interface ImportTaskExtended extends ImportTaskFull {
  progressValue?: ImportTaskProgress;
}

type Task = ImportTaskExtended | ImportTaskShort;

interface TasksBuffer {
  [key: number]: ImportTaskExtended;
}

@Component({
  selector: 'crg-data-import-tasks-list',
  templateUrl: './data-import-tasks-list.component.html',
  styleUrls: ['./data-import-tasks-list.component.scss']
})
export class DataImportTasksListComponent implements OnInit {
  @Input() tasks: ImportTaskShort[];

  private FETCH_DELAY = 100;

  private currentTaskNum = -1;
  private tasksBuffer: TasksBuffer = {};
  private lastFetched = 0;

  get extendedTasks (): Task[] {
    return this.tasks.map(task => (this.tasksBuffer[task.id] ? this.tasksBuffer[task.id] : task));
  }

  constructor(private importService: ImportService) { }

  ngOnInit () {
    this.fetchNextTask();
  }

  isPending (task: Task): boolean {
    return this.importService.isTaskPending(task);
  }

  isError (task: Task): boolean {
    return this.importService.isTaskError(task);
  }

  getDescription(task: Task): string {
    const { state } = task;
    const { taskStatusesList } = this.importService;
    if (Object.keys(taskStatusesList).includes(state)) {
      return taskStatusesList[state];
    } else {
      return 'Неопределенный статус';
    }
  }

  private fetchNextTask (): void {
    if (!this.hasUncompletedTasks()) { return; }

    const now = new Date().getTime();
    if (now - this.lastFetched < this.FETCH_DELAY) {
      setTimeout(() => {
        this.fetchNextTask();
      }, this.FETCH_DELAY - now + this.lastFetched);
      return;
    }
    this.lastFetched = now;

    this.bumpCurrentTaskNum();

    const task = this.extendedTasks[this.currentTaskNum];

    if (this.isTaskCompleted(task)) {
      this.fetchNextTask();
      return;
    }

    if (!this.isTaskFull(task)) {
      this.fillTask(task);
      return;
    }

    this.updateTaskProgress(task as ImportTaskExtended);
  }

  private updateTaskProgress (task: ImportTaskExtended) {
    this.importService.getImportTaskProgress(task).subscribe(progress => {
      this.tasksBuffer[task.id].progressValue = progress;
      this.tasksBuffer[task.id].state = progress.state;
      this.fetchNextTask();
    });
  }

  private fillTask (task: Task): void {
    this.importService.getFullImportTask(task).subscribe(({ task }) => {
      this.tasksBuffer[task.id] = task;
      this.fetchNextTask();
    });
  }

  private bumpCurrentTaskNum (): void {
    this.currentTaskNum = this.currentTaskNum === this.tasks.length - 1 ?
                            0 :
                            this.currentTaskNum + 1;
  }

  private hasUncompletedTasks (): boolean {
    return this.extendedTasks.some(task => !this.isTaskCompleted(task));
  }

  private isTaskCompleted (task: Task) {
    return this.isTaskExtended(task) && !this.isPending(task);
  }

  private isTaskFull (task: Task): boolean {
    return task.hasOwnProperty('layer');
  }

  private isTaskExtended (task: Task): boolean {
    return task.hasOwnProperty('progressValue');
  }
}
