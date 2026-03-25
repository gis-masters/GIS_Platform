import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Toast } from '../../components/Toast/Toast';
import { doAlert } from '../../services/answer-modals.service';
import { type Process, ProcessStatus } from '../../services/data/processes/processes.models';
import { getProcess } from '../../services/data/processes/processes.service';
import { schemaService } from '../../services/data/schema/schema.service';
import { type OldSchema } from '../../services/data/schema/schemaOld.models';
import { type Dataset } from '../../services/data/vectorData/vectorData.models';
import { type ImportLayer, type ImportLayerItem } from '../../services/geoserver/import/import.models';
import { doWorkImport, getAllImportLayers } from '../../services/geoserver/import/import.service';
import {
  type ComparableLayersPair,
  ImportDataHolderService
} from '../../services/geoserver/import/import-data-holder.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { currentImport } from '../../stores/CurrentImport.store';
import { currentProject } from '../../stores/CurrentProject.store';

@Component({
  selector: 'crg-mapping-page',
  templateUrl: './mapping-page.component.html',
  styleUrls: ['./mapping-page.component.css'],
  standalone: false
})
export class MappingPageComponent implements OnInit, OnDestroy {
  selectedLayer?: ImportLayerItem;
  isWorkImportInited = false;
  selectedDataset?: Dataset;
  comparableLayers?: ComparableLayersPair[];
  prevLink?: string;
  nextLink?: string;

  schemas?: OldSchema[];

  private CHECK_STATUS_INTERVAL = 1000;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
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
      await doAlert({
        message: 'Есть не обработанные слои',
        okText: 'Закончить обработку слоёв'
      });

      return;
    }

    this.isWorkImportInited = true;

    const workTasks = this.importData.getWorkTasks();

    await projectsService.fetchCurrent();

    const identifier = this.selectedDataset?.identifier;
    if (!identifier) {
      this.isWorkImportInited = false;

      return;
    }
    // TODO: Нельзя чтобы в рабочем импорте таски ссылались на одну рабочую таблицу!
    // Т.е. пользователь выбрал импорт в одну и тоже место несколько раз
    // eslint-disable-next-line promise/catch-or-return
    doWorkImport(workTasks, currentProject.id, identifier).then(
      (crgProcess: Process) => {
        interval(this.CHECK_STATUS_INTERVAL)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(async () => {
            const response: Process = await getProcess(crgProcess.id);
            switch (response.status) {
              case ProcessStatus.DONE: {
                this.unsubscribe$.next();
                projectsService.clearCurrent();

                const { projectId } = this.route.snapshot.params as Record<string, string>;
                void this.router.navigateByUrl(`/projects/${projectId}/map`);

                Toast.success('Импортировано успешно');

                break;
              }
              case ProcessStatus.DONE_WITH_WARNINGS: {
                this.unsubscribe$.next();
                projectsService.clearCurrent();

                const { projectId } = this.route.snapshot.params as Record<string, string>;
                void this.router.navigateByUrl(`/projects/${projectId}/map`);

                Toast.warn('Импорт завершен с предупреждениями. Проверьте отчет.');

                break;
              }
              case ProcessStatus.ERROR: {
                this.isWorkImportInited = false;

                this.unsubscribe$.next();
                projectsService.clearCurrent();

                break;
              }
              // No default
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
