import {BehaviorSubject, Observable} from 'rxjs';
import {publishReplay, refCount} from 'rxjs/operators';
import {PropertySchema} from '../../crg/data-schema.service';
import {MatchingPair, TaskImport} from './taskImport';
import {ProjectModel} from './projectModel';
import {InputStartResponseDto, LayerAttribute} from './models';
import {AS_IS_TYPE, ImportTargetType, NOT_IMPORT} from '../../crg/models';

export class WorkImport {

  private _tasks$: BehaviorSubject<TaskImport[]> = new BehaviorSubject<TaskImport[]>([]);
  public tasks$: Observable<TaskImport[]> = this._tasks$.asObservable()
    .pipe(
      publishReplay(1),
      refCount()
    );

  // Наименование рабочей области
  projectModel: ProjectModel;

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
    if (targetProperty.name === NOT_IMPORT.name) {
      return;
    }

    let newMapping = {
      source: source,
      target: {
        name: targetProperty.name,
        type: ImportTargetType.FROM_SCHEMA
      }
    };

    if (targetProperty.name === AS_IS_TYPE.name) {
      newMapping = {
        source: source,
        target: {
          name: source.name,
          type: targetProperty.name
        }
      };
    }

    this.getTaskByLayerName(layerName)
        .pairs.push(newMapping);
  }

  updateMapping(layerName: string, source: LayerAttribute, targetProperty: PropertySchema) {
    this.getTaskByLayerName(layerName)
        .pairs.forEach((mapItem: MatchingPair, index, array) => {
          if (mapItem.source.name === source.name) {
            if (targetProperty.name === NOT_IMPORT.name) {
              array.splice(index, 1);
            } else if (targetProperty.name === AS_IS_TYPE.name) {
              mapItem.target = {
                name: source.name,
                type: AS_IS_TYPE.name
              };
            } else {
              mapItem.target = {
                name: targetProperty.name,
                type: ImportTargetType.FROM_SCHEMA
              };
            }
          }
        });
  }

  setProject(projectModel: ProjectModel) {
    this.projectModel = projectModel;

    this.tasks.forEach((task: TaskImport) => {
      task.pairs = [];
      task.workTableName = undefined;
    });

    this.updateWorkImportState();
  }

  updateFeatureSchema(importLayerName: string, featureSchemaName: string) {
    const task = this.getTaskByLayerName(importLayerName);
    task.workTableName = featureSchemaName;
    task.pairs = [];

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
