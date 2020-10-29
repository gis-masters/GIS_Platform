import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import {
  ComparableLayersPair,
  ImportDataHolderService
} from '../../services/geoserver/import/import-data-holder.service';
import { getAllImportLayers } from '../../services/geoserver/import/import.service';
import { projectsService } from '../../services/crg/projects.service';
import { Process, ProcessStatus } from '../../services/models';
import { OrganizationService } from '../../services/crg/organization.service';
import { ImportLayer, ImportLayerItem } from '../../services/geoserver/import/models';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';
import { currentImport } from '../../stores/CurrentImport.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { schemaService, FeatureDescription } from '../../services/crg/schema.service';

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

  schemas?: FeatureDescription[];

  private CHECK_STATUS_INTERVAL = 1000;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog,
              private organizationService: OrganizationService,
              private router: Router,
              private route: ActivatedRoute,
              private importData: ImportDataHolderService,
              private logger: NGXLogger) {}

  async ngOnInit() {
    this.schemas = await schemaService.getAllSchemas();

    const { projectId, importId } = this.route.snapshot.params;
    this.prevLink = `/projects/${projectId}/import/${importId}`;
    this.nextLink = `/projects/${projectId}/map`;

    // TODO: Перенести логику блокирования страницы при неверных данных, по примеру WorkflowGuardService
    if (!currentImport.scratch) {
      this.router.navigateByUrl(`/projects/${projectId}/import`);
    }

    this.importData.comparableLayers$.subscribe((comparableLayers: ComparableLayersPair[]) => {
      this.comparableLayers = comparableLayers;
    });

    const importLayers = await getAllImportLayers();

    importLayers.forEach((importLayer: ImportLayer) => {
      this.importData.createCompatiblePair(importLayer.layer as ImportLayerItem);
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

  async startWorkImport () {
    if (!this.importData.isWorkImportReady) {
      this.dialog.open(AlertDialogComponent, {data: {message: 'Есть не обработанные слои'}});

      return;
    }

    this.isWorkImportInited = true;

    const workTasks = this.importData.getWorkTasks();

     await projectsService.fetchCurrent();

    // TODO: Нельзя чтобы в рпбочем импорте такси ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    projectsService
        .doWorkImport(workTasks, currentProject.id, currentProject.internalName)
        .then((crgProcess: Process) => {

          interval(this.CHECK_STATUS_INTERVAL)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async () => {
              const response: Process = await this.organizationService.getProcessById(crgProcess.id);
              if (response.status === ProcessStatus.DONE) {
                // this.layersService.fetchLayers(project);

                this.isWorkImportInited = false;
                this.isImportFinished = true;

                this.unsubscribe$.next();
                projectsService.clearCurrent();
              } else if (response.status === ProcessStatus.ERROR) {
                this.isWorkImportInited = false;
                this.isImportFinished = false;

                this.unsubscribe$.next();
                projectsService.clearCurrent();
              }
            });
        }, errorResponse => {
          this.logger.info('ERROR: ', errorResponse);

          this.isWorkImportInited = false;

          projectsService.clearCurrent();
        });
  }

  isActive(comparablePair: ComparableLayersPair) {
    return this.selectedLayer ? this.selectedLayer.name === comparablePair.originalLayer.name : false;
  }
}
