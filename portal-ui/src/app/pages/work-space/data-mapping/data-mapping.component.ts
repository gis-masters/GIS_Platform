import {NGXLogger} from 'ngx-logger';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';
import {LayersService} from '../../../services/geoserver/layers.service';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {GeoStyle, StylesService} from '../../../services/geoserver/styles.service';
import {TransformationService} from '../../../services/geoserver/transformation.service';
import {GisDbService, TableProjection} from '../../../services/geoserver/gis-db.service';
import {ImportFlow, ImportLayer, ImportService, LayerItem, TaskImport, WorkImport} from '../../../services/geoserver/import.service';
import {GeoDataStore, GeoWorkspace, GeoWorkspaceItem, WorkspacesService} from '../../../services/geoserver/workspaces.service';
import {GisClassDefinition, GisService} from "../../../services/gis/rules.service";

@Component({
  selector: 'crg-data-mapping',
  templateUrl: './data-mapping.component.html',
  styleUrls: ['./data-mapping.component.css']
})
export class DataMappingComponent implements OnInit, OnDestroy {

  @Output() workspaceChanged = new EventEmitter<string>();

  workspaces = [];
  layers: LayerItem[] = [];
  complexTypes: any = [];
  importFlow: ImportFlow;

  isImportFinished = false;
  isWorkImportInited = false;

  constructor(private workspacesService: WorkspacesService,
              private importService: ImportService,
              private transformationService: TransformationService,
              private workspaceService: WorkspacesService,
              private gisDbService: GisDbService,
              private authService: AuthService,
              private stylesService: StylesService,
              private ruleService: GisService,
              private layersService: LayersService,
              private router: Router,
              private logger: NGXLogger) {
    this.logger.info('DataMappingComponent start');
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
          this.logger.info('workspacesService.getAll: ', geoWorkspace.workspaces);

          this.workspaces = geoWorkspace.workspaces.workspace
              .map((item: NameHrefProjection) => item.name)
                // Не показываем 'scratch workspace'
              .filter(workspaceName => !workspaceName.includes(environment.scratchWorkspaceName));
        });

    this.importService
        .getAllImportLayers(true)
        .subscribe((layers: ImportLayer[]) => {
          this.logger.info('All Layers: ', layers);

          this.layers = layers
              .map((layer: ImportLayer) => {
                this.importService.importFlow.work_import.addTask(layer.layer.originalName);

                return layer.layer as LayerItem;
              });

          this.logger.info('All Layers: ', this.layers);
        });

    this.ruleService.getRules()
        .subscribe((data: GisClassDefinition) => {
          this.logger.info(' +++ rules: ', data);

        });
  }

  ngOnDestroy(): void {
    this.importService.importFlow.work_import.clear();
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

    // TODO: В СУБД под каждую организацию создается отдельная БД. Под каждый проект(рабочую область) создается схема
    // this.gisDbService.getDbTables('gis', 'fiz')
    //     .subscribe((projection: TableProjection[]) => {
    //       let i = 0;
    //       projection.forEach(value => {
    //         if (value.name.includes('_point')) {
    //           i++;
    //         }
    //       });
    //
    //       this.logger.info(' --- ', projection.length - i);
    //
    //       this.tablesP10 = projection;
    //     });
  }

  startWorkImport() {
    this.isWorkImportInited = true;

    const workImport = this.importFlow.work_import;
    this.gisDbService
        .doWorkImport(workImport)
        .subscribe((response: any) => {
          this.workspaceService
              .publishLayers(workImport)
              .subscribe(value => {
                this.isWorkImportInited = false;
                this.isImportFinished = true;

                this.addStyle(workImport);
              }, error1 => {
                this.isWorkImportInited = false;
              });
        }, errorResponse => {
          this.logger.info('ERROR: ', errorResponse);

          this.isWorkImportInited = false;
        });
  }

  private addStyle(workImport: WorkImport) {
    workImport.tasks.forEach((task: TaskImport) =>
      this.stylesService
          .getByName(task.workTableName)
          .subscribe((style: GeoStyle) => {
            this.logger.info(' *** style: ', style);

            this.layersService
                .addStyle(style.name, style.filename, task.workTableName)
                .subscribe(value => {
                  this.logger.info('Success add style: ', style);
                }, errorResponse => {
                  this.logger.error(errorResponse);
                });
          }, errorResponse => {
            this.logger.error(errorResponse);
          })
    );
  }
}
