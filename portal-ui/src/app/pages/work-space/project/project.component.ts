import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectModel} from '../../../services/geoserver/import/projectModel';
import {CrgProject, ProjectsService} from '../../../services/gis/projects.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {StorageKeys} from '../../../services/storage-keys';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../../components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'crg-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  isEditMode = false;
  projects: CrgProject[] = [];
  projectName = '';
  activeProject: string;
  errorMsg = '';

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private router: Router,
              private storageService: LocalStorageService,
              private projectsService: ProjectsService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.projectsService.fetchProjects();

    this.projectsService.projects$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((projects: CrgProject[]) => this.projects = projects);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openProject(project: CrgProject) {
    const projectModel = new ProjectModel(project);
    this.storageService.saveByKey(StorageKeys.projectKey, JSON.stringify(projectModel));

    this.router.navigateByUrl('/workspace/data_import');
  }

  createNew(event) {
    event.stopPropagation();
    this.errorMsg = '';

    this.projectsService
        .create(this.projectName)
        .subscribe(response => {
            this.isEditMode = false;
            this.projectsService.fetchProjects();
          },
          errors => {
            if (errors.error.toString().includes('already exists')) {
              this.errorMsg = 'Проект с таким названием уже существует';
            } else {
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

/*  deleteProject(pItem: CrgProject) {
    this.projectsService
        .delete(pItem.internalName)
        .subscribe(response => {
          this.logger.info('dddddddddddd', response);

          this.projectsService.fetchProjects();
        });
  }*/

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
          .subscribe(response => {
            this.logger.info('dddddddddddd', response);

            this.projectsService.fetchProjects();
          });
      }
    });
  }
}
