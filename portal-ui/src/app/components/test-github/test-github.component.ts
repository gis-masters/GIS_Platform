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
import {ValidationRequest, ValidationService} from "../../services/validation.service";
import {NGXLogger} from "ngx-logger";
import {of} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'crg-test-github',
  templateUrl: './test-github.component.html',
  styleUrls: ['./test-github.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TestGithubComponent implements OnChanges, AfterViewInit {

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

  expandedElement: any;

  constructor(private logger: NGXLogger,
              private validationService: ValidationService) {
    this.logger.info('TestGithubComponent constructor');
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
            return this.validationService
                       .getValidationResults(this.connectionInfo, this.paginator.pageIndex, this.paginator.pageSize);
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
        } else {
          this.logger.info('!---! ', response);
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
    this.logger.info(' --- getValidation ---', this._connectionInfo, this.isActive);

    if (this._connectionInfo) {
      this.validationService
          .getValidationResults(this.connectionInfo, 0, 25)
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

}

export interface Violations {
  violations: ViolationObject[];
}

export interface ViolationObject {
  name: string;
  value: string;
  errors: string;
}
