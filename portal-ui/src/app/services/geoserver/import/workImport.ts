import {BehaviorSubject, Observable} from 'rxjs';
import {publishReplay, refCount} from 'rxjs/operators';
import {PropertySchema} from '../../crg/data-schema.service';
import {InputStartResponseDto, LayerAttribute} from './import.service';
import {MappingItem, TaskImport} from './taskImport';
import {ProjectModel} from './projectModel';

export class WorkImport {

  private _tasks$: BehaviorSubject<TaskImport[]> = new BehaviorSubject<TaskImport[]>([]);
  public tasks$: Observable<TaskImport[]> = this._tasks$.asObservable()
    .pipe(
      publishReplay(1),
      refCount()
    );

  // Наименование рабочей области
  projectModel: ProjectModel;
  dataStore: string;

  // Сюда ложим ответ от сервера при инициализации импорта
  target_import: InputStartResponseDto;

  // Задачи по модификациям данных.
  tasks: TaskImport[] = [];
  isWorkImportReady = false;

  addTask(layerName: string, srs: string) {
    this.tasks.push(new TaskImport(layerName, srs));

    this.updateWorkImportState();
  }

  addMapping(layerName: string, source: LayerAttribute, targetProperty: PropertySchema) {
    const newMapping = {
      source: source,
      target: {
        name: targetProperty.name,
        type: targetProperty.name
      }
    };

    this.getTaskByLayerName(layerName)
        .mapping.push(newMapping);
  }

  updateMapping(layerName: string, source: LayerAttribute, property: PropertySchema) {
    this.getTaskByLayerName(layerName).mapping
        .forEach((mapItem: MappingItem) => {
          if (mapItem.source.name === source.name) {
            mapItem.target = {
              name: property.name,
              type: property.name
            };
          }
        });
  }

  setProject(projectModel: ProjectModel) {
    this.projectModel = projectModel;

    this.tasks.forEach((task: TaskImport) => {
      task.mapping = [];
      task.workTableName = undefined;
    });

    this.updateWorkImportState();
  }

  updateFeatureSchema(importLayerName: string, featureSchemaName: string) {
    const task = this.getTaskByLayerName(importLayerName);
    task.workTableName = featureSchemaName;
    task.mapping = [];

    this.updateWorkImportState();
  }

  clear() {
    this.projectModel = undefined;
    this.tasks = [];
    this.target_import = undefined;
    this.updateWorkImportState();
  }

  private updateWorkImportState() {
    if (this.projectModel) {
      this.isWorkImportReady = !this.tasks.find((task: TaskImport) => !task.workTableName);
    } else {
      this.isWorkImportReady = false;
    }

    this._tasks$.next(this.tasks);
  }

  private getTaskByLayerName(layerName: string) {
    const foundTask = this.tasks.find((task: TaskImport) => task.layerName === layerName);

    if (!foundTask) {
      throw Error('Not found task by name: ' + layerName);
    }

    return foundTask;
  }
}
