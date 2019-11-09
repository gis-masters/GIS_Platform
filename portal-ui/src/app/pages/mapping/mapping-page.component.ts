import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {
  ComparableLayersPair,
  ImportDataHolderService
} from '../../services/geoserver/import/import-data-holder.service';
import {MatDialog} from '@angular/material/dialog';
import {AlertDialogComponent} from '../../components/dialogs/alert-dialog/alert-dialog.component';
import {interval, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

import {LayersService} from '../../services/geoserver/layers.service';
import {ImportService} from '../../services/geoserver/import/import.service';
import {ProjectsService} from '../../services/crg/projects.service';
import {Process, ProcessStatus} from '../../services/crg/models';
import {OrganizationService} from '../../services/crg/organization.service';
import {ImportLayer, ImportLayerItem} from '../../services/geoserver/import/models';
import { currentImport } from '../../stores/CurrentImport.store';

@Component({
  selector: 'crg-mapping-page',
  templateUrl: './mapping-page.component.html',
  styleUrls: ['./mapping-page.component.css']
})
export class MappingPageComponent implements OnInit, OnDestroy {

  selectedLayer: ImportLayerItem;

  isImportFinished = false;
  isWorkImportInited = false;

  comparableLayers: ComparableLayersPair[];

  prevLink: string;
  nextLink: string;

  private CHECK_STATUS_INTERVAL = 1000;
  private WAIT_SERVER_RESPONSE_TIMER = 120000;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog,
              private importService: ImportService,
              private projectsService: ProjectsService,
              private organizationService: OrganizationService,
              private layersService: LayersService,
              private router: Router,
              private route: ActivatedRoute,
              private importData: ImportDataHolderService,
              private logger: NGXLogger) { }

  async ngOnInit() {
    const { projectId, importId } = this.route.snapshot.params;
    this.prevLink = `/project/${projectId}/import/${importId}`;
    this.nextLink = `/project/${projectId}/map`;

    // TODO: Перенести логику блокирования страницы при неверных данных, по примеру WorkflowGuardService
    if (!currentImport.scratch) {
      this.router.navigateByUrl(`/project/${projectId}/import`);
    }

    this.importData.project = await this.projectsService.getCurrent();
    this.importService
        .getAllImportLayers()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((importLayers: ImportLayer[]) => {
          importLayers.map((importLayer: ImportLayer) => {
            this.importData.createCompatiblePair(importLayer.layer as ImportLayerItem);
          });
        });

    this.importData.comparableLayers$.subscribe((comparableLayers: ComparableLayersPair[]) => {
      this.comparableLayers = comparableLayers;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.importData.clear();
  }

  selectLayer(comparableLayersPair: ComparableLayersPair) {
    comparableLayersPair.isActive = true;
    this.selectedLayer = comparableLayersPair.originalLayer;
  }

  startWorkImport() {
    if (!this.importData.isWorkImportReady) {
      this.dialog.open(AlertDialogComponent, {data: {message: 'Есть не обработанные слои'}});

      return;
    }

    this.isWorkImportInited = true;

    const workTasks = this.importData.getWorkTasks();
    const project = this.importData.project;

    // TODO: Нельзя чтобы в рпбочем импорте такси ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    this.projectsService
        .doWorkImport(workTasks, project.id, project.workspaceName)
        .then((crgProcess: Process) => {

          interval(this.CHECK_STATUS_INTERVAL)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async () => {
              const response: Process = await this.organizationService.getProcessById(crgProcess.id);
              if (response.status === ProcessStatus.DONE) {
                this.layersService.fetchLayers(project);

                this.isWorkImportInited = false;
                this.isImportFinished = true;

                this.unsubscribe$.next();
              } else if (response.status === ProcessStatus.ERROR) {
                this.isWorkImportInited = false;
                this.isImportFinished = false;

                this.unsubscribe$.next();
              }
            });

          // Прибьем проверку статуса если она зятянулась
          const waitTimer = setTimeout(() => {
            this.isWorkImportInited = false;
            this.isImportFinished = false;

            this.unsubscribe$.next();
          }, this.WAIT_SERVER_RESPONSE_TIMER);
        }, errorResponse => {
          this.logger.info('ERROR: ', errorResponse);

          this.isWorkImportInited = false;
        });
  }

  isActive(comparablePair: ComparableLayersPair) {
    return this.selectedLayer ? this.selectedLayer.name === comparablePair.originalLayer.name : false;
  }

}
