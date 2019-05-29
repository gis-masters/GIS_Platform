import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {StorageKeys} from '../../../services/storage-keys';
import {ProcessStatus} from '../../../services/process-status';
import {ProjectModel} from '../../../services/geoserver/import/projectModel';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {CrgProject, ProjectsService} from '../../../services/gis/projects.service';
import {DeleteDialogComponent} from '../../../components/delete-dialog/delete-dialog.component';
import {FizLogger} from '../../../services/logger/fiz.logger';

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
              private ruleService: FgistpRulesService,
              private dialog: MatDialog,
              private communicationService: CommunicationService) {
    this.communicationService.stepperEvents.emit(1);
  }

  ngOnInit() {
    this.ruleService.getRules().subscribe();
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
        .subscribe((project: CrgProject) => {
            this.isEditMode = false;
            this.projectsService.fetchProjects();

            this.checkProjectStatus(project);
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
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectsService
            .delete(pItem.internalName)
            .subscribe(response => this.projectsService.fetchProjects());
      }
    });
  }

  private checkProjectStatus(newProject: CrgProject) {
    const startTime = Date.now();
    const checkStatusInterval = setInterval(() => {
      if (startTime - Date.now() > 60000) {
        clearInterval(checkStatusInterval);
      }

      this.projectsService.getById(newProject.id)
          .subscribe((project: CrgProject) => {
            if (project.status === ProcessStatus.DONE) {
              this.projectsService.fetchProjects();
              clearInterval(checkStatusInterval);
            }
          });
    }, 5000);
  }

}
