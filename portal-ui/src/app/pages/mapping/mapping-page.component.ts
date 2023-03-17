import { NGXLogger } from 'ngx-logger';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Toast } from '../../components/Toast/Toast';
import { Dataset } from '../../services/data/vectorData/vectorData.models';
import {
  ComparableLayersPair,
  ImportDataHolderService
} from '../../services/geoserver/import/import-data-holder.service';
import { doWorkImport, getAllImportLayers } from '../../services/geoserver/import/import.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { ImportLayer, ImportLayerItem } from '../../services/geoserver/import/import.models';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';
import { currentImport } from '../../stores/CurrentImport.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { schemaService } from '../../services/data/schema/schema.service';
import { OldSchema } from '../../services/data/schema/schemaOld.models';
import { getProcess } from '../../services/data/processes/processes.service';
import { Process, ProcessStatus } from '../../services/data/processes/processes.models';

@Component({
  selector: 'crg-mapping-page',
  templateUrl: './mapping-page.component.html',
  styleUrls: ['./mapping-page.component.css']
})
export class MappingPageComponent implements OnInit, OnDestroy {
  selectedLayer: ImportLayerItem;
  isWorkImportInited = false;
  selectedDataset: Dataset;
  comparableLayers: ComparableLayersPair[];
  prevLink: string;
  nextLink: string;

  schemas?: OldSchema[];

  private CHECK_STATUS_INTERVAL = 1000;
  private unsubscribe$: Subject<void> = new Subject<void>();

  // eslint-disable-next-line max-params
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private importData: ImportDataHolderService,
    private logger: NGXLogger
  ) {}

  async ngOnInit() {
    this.schemas = await schemaService.getAllOldSchemas();

    const { projectId, importId } = this.route.snapshot.params as Record<string, string>;
    this.prevLink = `/projects/${projectId}/import/${importId}`;
    this.nextLink = `/projects/${projectId}/map`;

    // TODO: Перенести логику блокирования страницы при неверных данных, по примеру WorkflowGuardService
    if (!currentImport.scratch) {
      void this.router.navigateByUrl(`/projects/${projectId}/import`);
    }

    this.importData.comparableLayers$.subscribe((comparableLayers: ComparableLayersPair[]) => {
      this.comparableLayers = comparableLayers;
    });

    const importLayers = await getAllImportLayers();

    importLayers.forEach((importLayer: ImportLayer) => {
      void this.importData.createCompatiblePair(importLayer.layer);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.importData.clear();
  }

  selectLayer(comparableLayersPair: ComparableLayersPair): void {
    comparableLayersPair.isActive = true;
    this.selectedLayer = comparableLayersPair.originalLayer;
  }

  async startWorkImport(): Promise<void> {
    if (!this.importData.isWorkImportReady) {
      this.dialog.open(AlertDialogComponent, { data: { message: 'Есть не обработанные слои' } });

      return;
    }

    this.isWorkImportInited = true;

    const workTasks = this.importData.getWorkTasks();

    await projectsService.fetchCurrent();

    // TODO: Нельзя чтобы в рабочем импорте таски ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    // eslint-disable-next-line promise/catch-or-return
    doWorkImport(workTasks, currentProject.id, this.selectedDataset.identifier).then(
      (crgProcess: Process) => {
        interval(this.CHECK_STATUS_INTERVAL)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(async () => {
            const response: Process = await getProcess(crgProcess.id);
            if (response.status === ProcessStatus.DONE) {
              this.unsubscribe$.next();
              projectsService.clearCurrent();

              const { projectId } = this.route.snapshot.params as Record<string, string>;
              void this.router.navigateByUrl(`/projects/${projectId}/map`);

              Toast.success('Импортировано успешно');
            } else if (response.status === ProcessStatus.ERROR) {
              this.isWorkImportInited = false;

              this.unsubscribe$.next();
              projectsService.clearCurrent();
            }
          });
      },
      (error: unknown) => {
        this.logger.info('ERROR: ', error);

        this.isWorkImportInited = false;

        projectsService.clearCurrent();
      }
    );
  }

  isActive(comparablePair: ComparableLayersPair): boolean {
    return this.selectedLayer ? this.selectedLayer.name === comparablePair.originalLayer.name : false;
  }

  onDatasetSelected(dataset: Dataset): void {
    this.selectedDataset = dataset;
  }
}
