import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { startWith } from 'rxjs/internal/operators/startWith';
import { NGXLogger } from 'ngx-logger';

import { CrgLayer } from '../../../services/geoserver/layers.service';
import { CommunicationService } from '../../../services/communication.service';
import { DataSchemaService } from '../../../services/crg/data-schema.service';
import { getFeatureById } from '../../../services/geoserver/wfs.service';
import { WfsFeature } from '../../../services/geoserver/wfs-models';
import { OpenLayersService } from '../../../services/open-layer/open-layers.service';
import { ValidationResultsResponse, ValidationService } from '../../../services/crg/validation.service';
import { ProcessStatus } from '../../../services/crg/models';

@Component({
  selector: 'crg-bugs-table',
  templateUrl: './bugs-table.component.html',
  styleUrls: ['./bugs-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BugsTableComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() isActive: boolean;
  @Input() index: number;
  @Input() step: number;
  @Input() crgLayer: CrgLayer;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['objectid', 'classid', 'violationsCounter'];
  data: ValidationResultsResponse = {
    results: [],
    validated: false,
    total: 0,
    lastValidated: '',
    status: ProcessStatus.PENDING,
  };

  isLoadingResults = true;

  _step: number;
  totalElements = 0;
  defaultPageSize = 25;

  expandedElement: any;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService,
              private schemaService: DataSchemaService,
              private openLayers: OpenLayersService,
              private validationService: ValidationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const step = changes['step'];
    if (step && !step.isFirstChange()) {
      if (step.currentValue) {
        this._step = step.currentValue;

        if (this.index === this._step) {
          this.getValidation();
        }
      }
    }
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.isActive) {
            return this.validationService
                       .getValidationResults(this.crgLayer.name,
                                             this.paginator.pageIndex, this.paginator.pageSize,
                                             this.sort.active, this.sort.direction);
          } else {
            return of(null);
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe((response: ValidationResultsResponse) => this.handleResponse(response));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async getValidation() {
    const response: ValidationResultsResponse =
      await this.validationService.getValidationResults(this.crgLayer.name, 0, this.defaultPageSize, '', 'asc');

    this.handleResponse(response);
  }

  async showObject(event: Event, objectId: string) {
    event.stopPropagation();
    const wfsFeature: WfsFeature = await getFeatureById(this.crgLayer.complexName, objectId);
    this.openLayers.showFeature(wfsFeature);
  }

  editObject(event: Event, objectId: string) {
    event.stopPropagation();

    this.communicationService.editView.emit([{id: objectId, crgLayer: this.crgLayer}]);
  }

  private handleResponse(response: ValidationResultsResponse) {
    if (response) {
      this.data = response;
      this.data.results.forEach(bugObject => {
        bugObject.title = this.schemaService.getClassIdAlias(this.crgLayer.name, bugObject);
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
