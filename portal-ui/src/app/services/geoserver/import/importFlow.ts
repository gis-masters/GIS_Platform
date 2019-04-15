import {WorkImport} from './workImport';
import {ProjectModel} from './projectModel';
import {ImportTasks, InputStartResponseDto} from './import.service';

export class ImportFlow {
  scratch_import: InputStartResponseDto;
  work_import: WorkImport = new WorkImport();
  file: File;

  addTasks(tasks: ImportTasks, isScratch: boolean) {
    let target;
    if (isScratch) {
      target = this.scratch_import;
    } else {
      target = this.work_import.target_import;
    }

    target.import.tasks = [...tasks.tasks];
  }

  /**
   * Смена рабочей области обнуляем таблицу.
   * @param projectModel Проект
   */
  setProject(projectModel: ProjectModel) {
    this.work_import.setProject(projectModel);
  }

  setTable(layerName: string, newTableName: string) {
    this.work_import.updateTable(layerName, newTableName);
  }

}
