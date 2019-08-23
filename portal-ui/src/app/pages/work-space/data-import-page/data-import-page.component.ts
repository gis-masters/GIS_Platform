import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Component, OnDestroy} from '@angular/core';
import {CommunicationService} from '../../../services/communication.service';
import {ImportService} from '../../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-data-import-page',
  templateUrl: './data-import-page.component.html',
  styleUrls: ['./data-import-page.component.scss']
})
export class DataImportPageComponent implements OnDestroy {

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private importService: ImportService,
              private communicationService: CommunicationService) {
    this.communicationService.stepperEvents.emit(2);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  next() {
    this.router.navigateByUrl('/workspace/data_mapping');
  }
}
