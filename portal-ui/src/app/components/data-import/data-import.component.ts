import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {MatSnackBar} from '@angular/material';
import {CommunicationService} from '../../services/communication.service';
import {
  ImportService,
  ImportTaskFull,
  ImportTasks,
  ImportTaskShort,
  InputStartResponseDto
} from '../../services/geoserver/import/import.service';
import {filter, flatMap, takeUntil} from 'rxjs/operators';
import {interval, of, Subject} from 'rxjs';

@Component({
  selector: 'crg-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.scss']
})
export class DataImportComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef;

  isImportInited = false;
  isUploadComplete = false;
  isWrongExt = false;
  isImportFailed = false;

  uploader: FileUploader = new FileUploader({url: ''});

  hasBaseDropZoneOver = false;

  errors: string[] = [];
  errorTasks: ImportTaskFull[] = [];

  private CHECK_STATUS_INTERVAL = 1000;
  private WAIT_SERVER_RESPONSE_TIMER = 120000;

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

  clearFiles () {
    this.uploader.clearQueue();
    this.errors = [];
    this.errorTasks = [];
    this.isUploadComplete = false;
    this.isWrongExt = false;
    this.isImportFailed = false;
    this.fileInput.nativeElement.value = '';
  }

  fileSelectedHandler () {
    if (this.uploader.queue.length) {
      this.checkFile(this.uploader.queue[0]._file.name);

      if (!this.isWrongExt) {
        this.initScratchImport();
      }
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
          () => this.handleUpload(),
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
    interval(this.CHECK_STATUS_INTERVAL)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.importService
            .checkImportStatus(this.importService.importFlow.scratch_import.import.href)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
              successResponse => {
                if (successResponse.import.state === 'COMPLETE') {
                  this.unsubscribe$.next();
                  clearTimeout(waitTimer);

                  this.isImportInited = false;
                  this.isUploadComplete = true;
                  this.logger.info('Success uploaded');
                } else {
                  this.handleErrorsTasks(successResponse.import.tasks);
                }
              },
            );
      });

    // Прибьем проверку статуса если она зятянулась
    const waitTimer = setTimeout(() => {
      this.handleError('Failed start import');
      this.unsubscribe$.next();
    }, this.WAIT_SERVER_RESPONSE_TIMER);
  }

  private handleErrorsTasks(errorTasks: ImportTaskShort[]) {
    of(errorTasks)
      .pipe(
        flatMap((tasks: ImportTaskShort[]) => this.importService.getFullImportTasks(tasks)),
        takeUntil(this.unsubscribe$)
      ).subscribe((response: any[]) => {
        this.errorTasks = response.map(value => value.task);

        this.isImportFailed = true;
        this.isImportInited = false;
        this.unsubscribe$.next();
      });
  }

  private handleError(msg: string, response?: any, errors?: string[]) {
    this.logger.error(msg, response);

    if (errors) {
      this.errors = errors;
    }

    this.unsubscribe$.next();
    this.isImportFailed = true;
    this.isImportInited = false;
  }

}
