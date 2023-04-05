import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { startWith } from 'rxjs/internal/operators/startWith';
import { NGXLogger } from 'ngx-logger';

import { communicationService } from '../../../services/communication.service';
import { schemaService } from '../../../services/data/schema/schema.service';
import { getProjection } from '../../../services/geoserver/projections.service';
import { getFeaturesById } from '../../../services/geoserver/wfs/wfs.service';
import { mapService } from '../../../services/map/map.service';
import { getValidationResults } from '../../../services/data/validation/validation.service';
import { ValidationResultsResponse } from '../../../services/data/validation/validation.models';
import { ProcessStatus } from '../../../services/data/processes/processes.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { isUpdateAllowed } from '../../../services/data/permissions/permissions.service';

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
export class BugsTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() isActive: boolean;
  @Input() index: number;
  @Input() step: number;
  @Input() crgLayer: CrgVectorLayer;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['objectid', 'classid', 'violationsCounter'];
  data: ValidationResultsResponse = {
    results: [],
    validated: false,
    total: 0,
    lastValidated: '',
    status: ProcessStatus.PENDING
  };

  isLoadingResults = true;

  _step: number;
  totalElements = 0;
  defaultPageSize = 25;

  expandedElement: any;

  updatingAllowed = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  async ngOnInit(): Promise<void> {
    communicationService.needUpdateValidationResults.on(async () => {
      await this.getValidation();
    }, this);

    this.updatingAllowed = await isUpdateAllowed(this.crgLayer);
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
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.isActive
            ? getValidationResults(
                {
                  dataset: this.crgLayer.dataset,
                  table: this.crgLayer.tableName,
                  schemaId: this.crgLayer.schemaId
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
      .subscribe((response: ValidationResultsResponse) => this.handleResponse(response));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  async getValidation(): Promise<void> {
    const response: ValidationResultsResponse = await getValidationResults(
      {
        dataset: this.crgLayer.dataset,
        table: this.crgLayer.tableName,
        schemaId: this.crgLayer.schemaId
      },
      0,
      this.defaultPageSize,
      '',
      'asc'
    );

    this.handleResponse(response);
  }

  async showObject(event: Event, objectId: string): Promise<void> {
    event.stopPropagation();
    const [wfsFeature] = await getFeaturesById([objectId], this.crgLayer.complexName);

    const projection = getProjection(this.crgLayer.nativeCRS);
    mapService.highlightFeatures([wfsFeature], projection);
    mapService.positionToFeature(wfsFeature, projection);
  }

  editObject(event: Event, objectId: string): void {
    event.stopPropagation();

    communicationService.editBugObject.emit([{ id: objectId, crgLayer: this.crgLayer }]);
  }

  private handleResponse(response: ValidationResultsResponse) {
    if (response) {
      this.data = response;
      this.data.results.forEach(async bugObject => {
        bugObject.title = await schemaService.getClassIdAlias(this.crgLayer, bugObject);
      });

      this.totalElements = response.total;
      this.isLoadingResults = false;
    } else if (response === null) {
      return;
    } else {
      this.logger.warn('Incorrect response: ', response);
    }
  }
}
