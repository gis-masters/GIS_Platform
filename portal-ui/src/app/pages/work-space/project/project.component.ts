import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StorageKeys} from '../../../services/storage-keys';
import {FizLogger} from '../../../services/logger/fiz.logger';
import {ProcessStatus} from '../../../services/process-status';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ProjectModel} from '../../../services/geoserver/import/projectModel';
import {CommunicationService} from '../../../services/communication.service';
import {DataSchemaService} from '../../../services/crg/data-schema.service';
import {CrgProject, ProjectsService} from '../../../services/crg/projects.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';
import {ProcessResponse} from '../../../services/models/requestModel';

@Component({
  selector: 'crg-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  isEditMode = false;
  projects: CrgProject[] = [];
  isProjectsLoaded = false;
  projectName = '';
  activeProject: string;
  errorMsg = '';

  private unsubscribe$: Subject<void> = new Subject<void>();
  pending = ProcessStatus.PENDING;
  done = ProcessStatus.DONE;

  constructor(private logger: NGXLogger,
              private router: Router,
              private log: FizLogger,
              private storageService: LocalStorageService,
              private projectsService: ProjectsService,
              private ruleService: DataSchemaService,
              private dialog: MatDialog,
              private communicationService: CommunicationService) {
    this.log.debug('setUp', 'ProjectComponent constructor');

    this.communicationService.stepperEvents.emit(1);
  }

  ngOnInit() {
    this.ruleService.getFeaturesDefinition().subscribe();
    this.projectsService.fetchProjects();

    this.projectsService.projects$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((projects: CrgProject[]) => {
          this.log.info('projects', 'projects$ on component', projects);

          this.isProjectsLoaded = true;
          this.projects = projects;
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openProject(project: CrgProject) {
    const projectModel = new ProjectModel(project);
    this.storageService.saveByKey(StorageKeys.projectKey, JSON.stringify(projectModel));

    if (project.layersCount > 0) {
      this.router.navigateByUrl('/workspace/map');
    } else {
      this.router.navigateByUrl('/workspace/data_import');
    }
  }

  createNew(event) {
    event.stopPropagation();
    this.errorMsg = '';

    this.projectsService
        .create(this.projectName)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((process: ProcessResponse) => {
            this.isEditMode = false;
            this.projectsService.fetchProjects();

            this.checkProjectStatus(process);
          },
          errors => {
            if (errors.error.status === 409) {
              this.errorMsg = errors.error.message;
            } else {
              this.logger.warn('', errors);
              this.errorMsg = 'Ошибка при создании проекта';
            }
          });
  }

  cancel(event) {
    event.stopPropagation();

    this.errorMsg = '';
    this.isEditMode = false;
  }

  switchMode() {
    this.isEditMode = true;
    this.projectName = '';
  }

  hoverBy(pItem: CrgProject) {
    this.activeProject = pItem.internalName;
  }

  stopHover() {
    this.activeProject = '';
  }

  openDeleteDialog(pItem: CrgProject): void {
    const data: ConfirmDialogData = {
      title: 'Вы действительно хотите удалить проект?',
      approveBtnName: 'Удалить'
    };

    this.dialog
        .open(ConfirmDialogComponent, {width: '400px', data: data})
        .afterClosed().subscribe(result => {
          if (result) {
            this.projectsService.delete(pItem.id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(response => this.projectsService.fetchProjects());
          }
        });
  }

  private checkProjectStatus(processResponse: ProcessResponse) {
    const startTime = Date.now();
    const checkStatusInterval = setInterval(() => {
      if (startTime - Date.now() > 60000) {
        clearInterval(checkStatusInterval);
      }

      this.projectsService.getById(processResponse.extra.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((project: CrgProject) => {
            if (project.status === ProcessStatus.DONE) {
              this.projectsService.fetchProjects();
              clearInterval(checkStatusInterval);
            }
          });
    }, 5000);
  }

}
