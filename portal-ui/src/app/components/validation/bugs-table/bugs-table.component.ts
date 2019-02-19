import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {switchMap} from "rxjs/internal/operators/switchMap";
import {MatPaginator, MatSort} from "@angular/material";
import {merge} from "rxjs/internal/observable/merge";
import {startWith} from "rxjs/internal/operators/startWith";
import {ValidationRequest, ValidationService} from "../../../services/gis/validation.service";
import {NGXLogger} from "ngx-logger";
import {of} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CommunicationService} from "../../../services/communication.service";
import {FgistpRulesService} from "../../../services/gis/fgistp-rules.service";

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
  @Input() connectionInfo: ValidationRequest;
  @Output() getConnectionInfo = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['objectid', 'classid', 'violationsCounter'];
  data: any[] = [];
  isLoadingResults = true;

  _connectionInfo: ValidationRequest;
  status: string;
  _step: number;
  totalElements = 0;
  defaultPageSize = 25;

  expandedElement: any;

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService,
              private ruleService: FgistpRulesService,
              private validationService: ValidationService) {
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.isActive && !!this.connectionInfo) {
            return this.validationService.getValidationResults(this.connectionInfo, this.paginator, this.sort);
          } else {
            return of(null);
          }
        }),
      ).subscribe(response => {
        if (response) {
          this.data = response.results;
          this.totalElements = response.total;
          this.status = response.status;

          this.isLoadingResults = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const requestInfo = changes['connectionInfo'];
    if (requestInfo && !requestInfo.isFirstChange()) {
      if (requestInfo.currentValue) {
        this._connectionInfo = requestInfo.currentValue;

        this.getValidation();
      }
    }

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

  getValidation() {
    if (this._connectionInfo) {
      this.validationService
          .getValidationResults_(this.connectionInfo, 0, this.defaultPageSize, '', 'asc')
          .subscribe(response => {
            this.data = response.results;
            this.totalElements = response.total;
            this.status = response.status;

            this.isLoadingResults = false;
          });
    } else {
      this.getConnectionInfo.emit(this.index - 1);
    }
  }

  showObject(event, objectId: string) {
    event.stopPropagation();

    this.communicationService.gotoObject.emit({id: objectId, layerName: this._connectionInfo.tableName});
  }

  getClassIdAlias(element) {
    return this.ruleService.getClassIdAlias(this.connectionInfo.tableName, element);
  }

  editObject(event, objectId: string) {
    event.stopPropagation();

    this.communicationService.editView.emit([{id: objectId, layerName: this._connectionInfo.tableName}]);
  }
}

export interface Violations {
  violations: ViolationObject[];
}

export interface ViolationObject {
  name: string;
  value: string;
  errors: string;
}
