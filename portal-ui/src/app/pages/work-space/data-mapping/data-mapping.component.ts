import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, filter, takeUntil} from 'rxjs/operators';
import {ImportFlow} from '../../../services/geoserver/import/importFlow';
import {LayersService} from '../../../services/geoserver/layers.service';
import {StylesService} from '../../../services/geoserver/styles.service';
import {TaskImport} from '../../../services/geoserver/import/taskImport';
import {WorkspacesService} from '../../../services/geoserver/workspaces.service';
import {ImportLayer, ImportService, LayerItem} from '../../../services/geoserver/import/import.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {StorageKeys} from '../../../services/storage-keys';
import {ProjectModel} from '../../../services/geoserver/import/projectModel';
import {ProjectsService} from '../../../services/crg/projects.service';

@Component({
  selector: 'crg-data-mapping',
  templateUrl: './data-mapping.component.html',
  styleUrls: ['./data-mapping.component.css']
})
export class DataMappingComponent implements OnInit, OnDestroy {

  layers: LayerItem[] = [];
  selectedLayer: LayerItem;

  importFlow: ImportFlow;
  isImportFinished = false;
  isWorkImportInited = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private workspacesService: WorkspacesService,
              private importService: ImportService,
              private workspaceService: WorkspacesService,
              private projectsService: ProjectsService,
              private stylesService: StylesService,
              private layersService: LayersService,
              private storageService: LocalStorageService,
              private router: Router,
              private logger: NGXLogger) {
    // TODO: Перенести логику блокирования страницы при неверных данных, по примеру WorkflowGuardService
    this.importFlow = this.importService.importFlow;
    if (!this.importFlow.scratch_import && !this.importFlow.scratch_import) {
      this.router.navigateByUrl('/workspace/data_import');
      throw Error('WRONG WAY');
    }

    const projectModel = JSON.parse(this.storageService.getByKey(StorageKeys.projectKey)) as ProjectModel;
    this.importService.importFlow.setProject(projectModel);
  }

  ngOnInit() {
    this.importService
        .getAllImportLayers(true)
        .subscribe((layers: ImportLayer[]) => {
          this.layers = layers
              .map((layer: ImportLayer) => {
                this.importService.importFlow.work_import.addTask(layer.layer.originalName);

                return layer.layer as LayerItem;
              });
        });

    this.importFlow.work_import.tasks$
        .pipe(
          filter(value => !!value && !!value.length),
          debounceTime(100),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((tasks: TaskImport[]) => {
          tasks.forEach((task: TaskImport) => {
            const layerItem = this.layers.find(layer => layer.originalName === task.layerName);
            if (layerItem) {
              layerItem.isMapped = task.isPrepared();
            }
          });
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.importService.importFlow.work_import.clear();
  }

  selectLayer(layer: LayerItem) {
    this.layers.forEach(value => value.isActive = false);

    layer.isActive = true;
    this.selectedLayer = layer;
  }

  startWorkImport() {
    this.isWorkImportInited = true;

    const workImport = this.importFlow.work_import;

    // TODO: Нельзя чтобы в рпбочем импорте такси ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    this.projectsService
        .doWorkImport(workImport)
        .subscribe((response: any) => {
          this.workspaceService
              .publishLayers(workImport)
              .subscribe(value => {
                this.isWorkImportInited = false;
                this.isImportFinished = true;

                // this.addStyle(workImport);
              }, error1 => {
                this.isWorkImportInited = false;
              });
        }, errorResponse => {
          this.logger.info('ERROR: ', errorResponse);

          this.isWorkImportInited = false;
        });
  }

  // private addStyle(workImport: WorkImport) {
  //   workImport.tasks.forEach((task: TaskImport) =>
  //     this.stylesService
  //         .getByName(task.workTableName)
  //         .subscribe((style: GeoStyle) => {
  //           this.logger.info(' *** style: ', style);
  //
  //           this.layersService
  //               .addStyle(style.name, style.filename, task.workTableName)
  //               .subscribe(value => {
  //                 this.logger.info('Success add style: ', style);
  //               }, errorResponse => {
  //                 this.logger.error(errorResponse);
  //               });
  //         }, errorResponse => {
  //           this.logger.error(errorResponse);
  //         })
  //   );
  // }
}
