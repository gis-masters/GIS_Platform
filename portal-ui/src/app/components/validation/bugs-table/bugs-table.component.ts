import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NGXLogger } from 'ngx-logger';
import { of, Subject } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { takeUntil } from 'rxjs/operators';

import { communicationService } from '../../../services/communication.service';
import { ProcessStatus } from '../../../services/data/processes/processes.models';
import { getProjectionByCode } from '../../../services/data/projections/projections.service';
import { schemaService } from '../../../services/data/schema/schema.service';
import { ValidationResultsResponse } from '../../../services/data/validation/validation.models';
import { getValidationResults } from '../../../services/data/validation/validation.service';
import { getFeaturesById } from '../../../services/geoserver/wfs/wfs.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { mapService } from '../../../services/map/map.service';
import { isUpdateAllowed } from '../../../services/permissions/permissions.service';

const invalid = 'Не переданы обязательные параметры';

@Component({
  selector: 'crg-bugs-table',
  templateUrl: './bugs-table.component.html',
  styleUrls: ['./bugs-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})

/**
 * @deprecated
 */
export class BugsTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() isActive?: boolean;
  @Input() index?: number;
  @Input() step?: number;
  @Input() crgLayer?: CrgVectorLayer;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  displayedColumns: string[] = ['objectid', 'classid', 'violationsCounter'];
  data: ValidationResultsResponse = {
    results: [],
    validated: false,
    total: 0,
    lastValidated: '',
    status: ProcessStatus.PENDING
  };

  isLoadingResults = true;

  _step?: number;
  totalElements = 0;
  defaultPageSize = 25;

  expandedElement: unknown;

  updatingAllowed = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  async ngOnInit(): Promise<void> {
    communicationService.needUpdateValidationResults.on(async () => {
      await this.getValidation();
    }, this);

    this.updatingAllowed = !!this.crgLayer && (await isUpdateAllowed(this.crgLayer));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const step = changes.step;
    if (step && !step.isFirstChange() && step.currentValue) {
      this._step = Number(step.currentValue);

      if (this.index === this._step) {
        void this.getValidation();
      }
    }
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.

    if (!this.crgLayer || !this.paginator || !this.sort) {
      throw new Error(invalid);
    }

    this.sort?.sortChange.subscribe(() => {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          if (!this.crgLayer || !this.paginator || !this.sort) {
            throw new Error(invalid);
          }

          return this.isActive
            ? getValidationResults(
                {
                  dataset: this.crgLayer.dataset,
                  table: this.crgLayer.tableName
                },
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.sort.active,
                this.sort.direction
              )
            : of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((response: ValidationResultsResponse | null) => {
        if (!response) {
          return;
        }
        void this.handleResponse(response);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  async getValidation(): Promise<void> {
    if (!this.crgLayer) {
      throw new Error(invalid);
    }

    const response: ValidationResultsResponse = await getValidationResults(
      {
        dataset: this.crgLayer.dataset,
        table: this.crgLayer.tableName
      },
      0,
      this.defaultPageSize,
      '',
      'asc'
    );

    await this.handleResponse(response);
  }

  async showObject(event: Event, objectId: string): Promise<void> {
    event.stopPropagation();
    if (!this.crgLayer?.complexName) {
      this.logger.warn('Невозможно отобразить объект: complexName = undefined');

      return;
    }

    const [wfsFeature] = await getFeaturesById([objectId], this.crgLayer.complexName);
    const projection = await getProjectionByCode(this.crgLayer.nativeCRS);

    await mapDrawService.reDrawFeatures([wfsFeature], projection);
    await mapService.positionToFeature(wfsFeature, projection);
  }

  editObject(event: Event, objectId: string): void {
    event.stopPropagation();
    if (!this.crgLayer) {
      throw new Error(invalid);
    }

    communicationService.editBugObject.emit([{ id: objectId, crgLayer: this.crgLayer }]);
  }

  private async handleResponse(response: ValidationResultsResponse) {
    if (!this.crgLayer) {
      throw new Error(invalid);
    }

    if (response) {
      this.data = response;
      for (const bugObject of this.data.results) {
        bugObject.title = await schemaService.getClassIdAlias(this.crgLayer, bugObject);
      }

      this.totalElements = response.total;
      this.isLoadingResults = false;
    } else if (response === null) {
      return;
    } else {
      this.logger.warn('Incorrect response: ', response);
    }
  }
}
