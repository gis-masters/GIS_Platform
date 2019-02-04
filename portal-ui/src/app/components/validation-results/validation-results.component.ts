import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NGXLogger} from "ngx-logger";
import {ValidationRequest, ValidationService} from "../../services/validation.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'crg-validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ValidationResultsComponent implements OnChanges, OnInit {

  @Input() index: number;
  @Input() step: number;
  @Input() connectionInfo: ValidationRequest;
  @Output() getConnectionInfo = new EventEmitter<number>();

  isLoadingResults = true;
  _connectionInfo: ValidationRequest;
  private _step: number;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  status: string;
  totalElements = 0;
  columnsToDisplay = ['objectid', 'violationAsString'];
  expandedElement: PeriodicElement | null;

  constructor(private logger: NGXLogger,
              private validationService: ValidationService) {
    this.logger.info('ValidationResultsComponent constructor')

    // this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {

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
          .getValidation(this.connectionInfo, 0, 10)
          .subscribe(response => {
            this.logger.info('!!!!!!!!! ', response);

            this.dataSource = new MatTableDataSource(response.results);
            this.dataSource.paginator = this.paginator;

            this.totalElements = response.total;
            this.status = response.status;

            this.isLoadingResults = false;
          });
    } else {
      this.getConnectionInfo.emit(this.index - 1);
    }
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
