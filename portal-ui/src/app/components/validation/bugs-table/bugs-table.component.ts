import {of} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {merge} from 'rxjs/internal/observable/merge';
import {MatPaginator, MatSort} from '@angular/material';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {startWith} from 'rxjs/internal/operators/startWith';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {CommunicationService} from '../../../services/communication.service';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ValidationResultsResponse, ValidationService} from '../../../services/gis/validation.service';
import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {WfsFeature, WfsService} from '../../../services/geoserver/wfs.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {ProcessStatus} from '../../../services/process-status';

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
export class BugsTableComponent implements OnChanges, AfterViewInit {

  @Input() isActive: boolean;
  @Input() index: number;
  @Input() step: number;
  @Input() crgLayer: CrgLayer;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['objectid', 'classid', 'violationsCounter'];
  data: ValidationResultsResponse = {
    results: [],
    validated: false,
    totalViolations: 0,
    lastValidationDateTime: '',
    status: ProcessStatus.EMPTY,
  };

  isLoadingResults = true;

  _step: number;
  totalElements = 0;
  defaultPageSize = 25;

  expandedElement: any;

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService,
              private ruleService: FgistpRulesService,
              private wfsService: WfsService,
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
          if (this.isActive && !!this.crgLayer.connectionInfo) {
            return this.validationService.getValidationResults(this.crgLayer.connectionInfo, this.paginator, this.sort);
          } else {
            return of(null);
          }
        }),
      ).subscribe((response: ValidationResultsResponse) => this.handleResponse(response));
  }

  getValidation() {
    this.validationService
        .getValidationResults_(this.crgLayer.connectionInfo, 0, this.defaultPageSize, '', 'asc')
        .subscribe((response: ValidationResultsResponse) => this.handleResponse(response));
  }

  getClassIdAlias(element) {
    return this.ruleService.getClassIdAlias(this.crgLayer.connectionInfo.tableName, element);
  }

  showObject(event, objectId: string) {
    event.stopPropagation();

    this.wfsService
        .getFeatureById(this.crgLayer.complexName, objectId)
        .subscribe(
          (wfsFeature: WfsFeature) => this.openLayers.showFeature(wfsFeature),
          error => this.logger.error(error)
        );
  }

  editObject(event, objectId: string) {
    event.stopPropagation();

    this.communicationService.editView.emit([{id: objectId, crgLayer: this.crgLayer}]);
  }

  private handleResponse(response: ValidationResultsResponse) {
    if (response) {
      this.data = response;
      this.totalElements = response.totalViolations;
      this.isLoadingResults = false;
    }
  }
}
