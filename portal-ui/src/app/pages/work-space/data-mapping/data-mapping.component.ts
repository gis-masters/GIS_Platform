import {NGXLogger} from 'ngx-logger';
import {debounceTime, filter, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';
import {GisDbService} from '../../../services/gis/gis-db.service';
import {LayersService} from '../../../services/geoserver/layers.service';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StylesService} from '../../../services/geoserver/styles.service';
import {
  GeoDataStore,
  GeoWorkspace,
  GeoWorkspaceItem,
  WorkspacesService
} from '../../../services/geoserver/workspaces.service';
import {ImportLayer, ImportService, LayerItem} from '../../../services/geoserver/import/import.service';
import {Subject} from 'rxjs';
import {ImportFlow} from '../../../services/geoserver/import/importFlow';
import {TaskImport} from '../../../services/geoserver/import/taskImport';

@Component({
  selector: 'crg-data-mapping',
  templateUrl: './data-mapping.component.html',
  styleUrls: ['./data-mapping.component.css']
})
export class DataMappingComponent implements OnInit, OnDestroy {

  workspaces = [];

  layers: LayerItem[] = [];
  selectedLayer: LayerItem;

  importFlow: ImportFlow;
  isImportFinished = false;
  isWorkImportInited = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private workspacesService: WorkspacesService,
              private importService: ImportService,
              private workspaceService: WorkspacesService,
              private gisDbService: GisDbService,
              private authService: AuthService,
              private stylesService: StylesService,
              private layersService: LayersService,
              private router: Router,
              private logger: NGXLogger) {
    this.authService.validateAuth();

    this.importFlow = this.importService.importFlow;
    if (!this.importFlow.scratch_import && !this.importFlow.scratch_import) {
      this.router.navigateByUrl('/workspace/data_import');
      throw Error('WRONG WAY');
    }
  }

  ngOnInit() {
    this.workspacesService.getAll()
        .pipe(filter(value => !!value['workspaces']))
        .subscribe((geoWorkspace: GeoWorkspace) => {
          // this.logger.info('workspacesService.getAll: ', geoWorkspace.workspaces);

          this.workspaces = geoWorkspace.workspaces.workspace
              .map((item: NameHrefProjection) => item.name)
                // Не показываем 'scratch workspace'
              .filter(workspaceName => !workspaceName.includes(environment.scratchWorkspaceName));
        });

    this.importService
        .getAllImportLayers(true)
        .subscribe((layers: ImportLayer[]) => {
          this.layers = layers
              .map((layer: ImportLayer) => {
                this.importService.importFlow.work_import.addTask(layer.layer.originalName);

                return layer.layer as LayerItem;
              });

          this.logger.info('All Import Layers: ', this.layers);
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

  workspaceSelected(selectedWorkspace: any) {
    this.importService.importFlow.setWorkspace(selectedWorkspace);

    this.workspaceService
        .getWorkspaceByName(selectedWorkspace)
        .subscribe((data: any) => {
          const workspace = data.workspace as GeoWorkspaceItem;

          this.workspacesService
              .getWorkspaceDataStore(workspace.dataStores)
              .subscribe((geoDataStore: GeoDataStore) => {
                // TODO:  Cannot read property 'length' of undefined
                if (geoDataStore.dataStores.dataStore.length > 1) {
                  this.logger.warn('У рабочей области несколько хранилищь?');
                }

                const storeName = geoDataStore.dataStores.dataStore[0].name;
                this.importService.importFlow.work_import.dataStore = storeName;
              });
        });
  }

  startWorkImport() {
    this.isWorkImportInited = true;

    const workImport = this.importFlow.work_import;

    // TODO: Нельзя чтобы в рпбочем импорте такси ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    this.gisDbService
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
