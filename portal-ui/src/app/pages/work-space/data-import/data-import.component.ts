import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {ImportService, ImportTasks, InputStartResponseDto} from '../../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.css']
})
export class DataImportComponent {
  private WAIT_SERVER_RESPONSE_TIMER = 120000;
  private CHECK_STATUS_INTERVAL = 500;

  isImportInited = false;
  isUploadComplete = false;

  public uploader: FileUploader = new FileUploader({url: ''});

  public hasBaseDropZoneOver = false;

  constructor(private logger: NGXLogger,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private importService: ImportService) {
    this.authService.validateAuth();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initScratchImport() {
    this.logger.info('Start scratch import');

    this.isUploadComplete = false;
    this.isImportInited = true;
    this.importService
        .initScratchImport()
        .subscribe(
          (data: InputStartResponseDto) => this.addTask(data),
          errorResponse => this.handleError('Start import failed', errorResponse)
        );
  }

  private addTask(data: InputStartResponseDto) {
    this.importService.importFlow.scratch_import = data;
    this.importService
        .addTask(data.import.href, this.uploader.queue[0]._file)
        .subscribe(
          (tasks: ImportTasks) => this.handleTask(tasks),
          errorResponse => this.handleError('Add task failed', errorResponse)
        );
  }

  private uploadToScratch() {
    this.logger.info('Start upload to scratch store');

    this.importService
        .startScratchUpload()
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

    this.isImportInited = false;
    this.snackBar.open('Failed start import', 'X', {
      duration: 5000,
    });
  }

}
