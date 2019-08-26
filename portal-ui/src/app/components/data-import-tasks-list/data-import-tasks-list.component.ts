import {Component, Input} from '@angular/core';
import {ImportTaskFull, ImportService} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-data-import-tasks-list',
  templateUrl: './data-import-tasks-list.component.html',
  styleUrls: ['./data-import-tasks-list.component.scss']
})
export class DataImportTasksListComponent {

  @Input() tasks: ImportTaskFull[];

  constructor(private importService: ImportService) { }

  isError (task: ImportTaskFull): boolean {
    return this.importService.isTaskError(task);
  }

  getDescription(task: ImportTaskFull): string {
    const { state } = task;
    const { taskStatusesList } = this.importService;
    if (Object.keys(taskStatusesList).includes(state)) {
      return taskStatusesList[state];
    } else {
      return 'Неопределенный статус';
    }
  }
}
