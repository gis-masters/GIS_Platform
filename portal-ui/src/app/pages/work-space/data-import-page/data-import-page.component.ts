import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component, OnDestroy} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {MatSnackBar} from '@angular/material';
import {CommunicationService} from '../../../services/communication.service';
import {ImportService, ImportTasks, InputStartResponseDto} from '../../../services/geoserver/import/import.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'crg-data-import-page',
  templateUrl: './data-import-page.component.html'
})
export class DataImportPageComponent implements OnDestroy {

  isImportInited = false;
  isUploadComplete = false;
  isWrongExt = false;
  isImportFailed = false;

  public uploader: FileUploader = new FileUploader({url: ''});

  public hasBaseDropZoneOver = false;

  private unsubscribe$: Subject<void> = new Subject<void>();
  private WAIT_SERVER_RESPONSE_TIMER = 120000;
  private CHECK_STATUS_INTERVAL = 500;

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

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initScratchImport() {
    this.isImportFailed = false;
    this.isUploadComplete = false;
    this.isImportInited = true;
    this.importService
        .initScratchImport()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: InputStartResponseDto) => this.addTask(data),
          errorResponse => this.handleError('Start import failed', errorResponse)
        );
  }

  checkFile(name: string) {
    const extension = name.split('.')[1];
    if (extension) {
      if (extension === 'zip') {
        return false;
      } else {
        this.isWrongExt = true;
        return true;
      }
    } else {
      return true;
    }
  }

  next() {
    this.router.navigateByUrl('/workspace/data_mapping');
  }

  private addTask(data: InputStartResponseDto) {
    this.importService.importFlow.scratch_import = data;
    this.importService
        .addTask(data.import.href, this.uploader.queue[0]._file)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (tasks: ImportTasks) => this.handleTask(tasks),
          errorResponse => this.handleError('Add task failed', errorResponse)
        );
  }

  private uploadToScratch() {
    this.importService
        .startScratchUpload()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          successResponse => this.handleUpload(),
          errorResponse => {
            if (errorResponse.error.message === 'Read timed out') {
              this.handleUpload();
            } else {
              this.handleError('Upload failed', errorResponse);
              this.isImportInited = false;
            }
          }
        );
  }

  private handleTask(importTask: ImportTasks) {
    this.importService.importFlow.addTasks(importTask, true);

    if (importTask.tasks) {
      // TODO: проверить каждую таску на валидность. Невалидные прибить?
      // Наужно проверять так как могут подсунуть невалидные файлы
      // "state": "READY"

      this.uploadToScratch();
    }
  }

  private handleUpload() {
    const importStatusChecker = setInterval(() => {
      this.importService
          .checkImportStatus(this.importService.importFlow.scratch_import.import.href)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            successResponse => {
              if (successResponse.import.state === 'COMPLETE') {
                clearInterval(importStatusChecker);
                clearTimeout(waitTimer);

                this.isImportInited = false;
                this.isUploadComplete = true;
                this.logger.info('Success uploaded');
              }
            },
          );
    }, this.CHECK_STATUS_INTERVAL);

    // Прибьем проверку статуса если она зятянулась
    const waitTimer = setTimeout(() => {
      if (importStatusChecker) {
        this.handleError('Failed start import');
        clearInterval(importStatusChecker);
      }
    }, this.WAIT_SERVER_RESPONSE_TIMER);
  }

  private handleError(msg: string, response?: any) {
    this.logger.error(msg, response);

    this.isImportFailed = true;
    this.isImportInited = false;
  }
}
