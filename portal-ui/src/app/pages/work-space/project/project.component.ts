import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {WorkspacesService} from '../../../services/geoserver/workspaces.service';

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
              private workspaceService: WorkspacesService) {

  }

  ngOnInit() {
    this.workspaceService.fetchWorkspaces();

    this.workspaceService.workspaces$
        .pipe(
          takeUntil(this.unsubscribe$),
          map((workspaces: NameHrefProjection[]) => this.mapToProjects(workspaces))
        )
        .subscribe((projects: CrgProject[]) => this.projects = projects);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openProject(project: CrgProject) {
    this.router.navigateByUrl('/workspace/map');
  }

  createNew(event) {
    event.stopPropagation();
    this.errorMsg = '';

    this.workspaceService
        .create(this.projectName)
        .subscribe(response => {
            this.isEditMode = false;
            this.workspaceService.fetchWorkspaces();
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

  deleteProject(pItem: CrgProject) {
    this.workspaceService
        .delete(pItem.name)
        .subscribe(response => {
          this.logger.info('dddddddddddd', response);

          this.workspaceService.fetchWorkspaces();
        });
  }

  hoverBy(pItem: CrgProject) {
    this.activeProject = pItem.name;
  }

  stopHover() {
    this.activeProject = '';
  }

  private mapToProjects(workspaces: NameHrefProjection[]): CrgProject[] {
    return workspaces.map((wItem: NameHrefProjection) => {
      return {
        name: wItem.name,
        title: '',
        href: wItem.href,
        type: ''
      };
    });
  }

}

export interface CrgProject {
  name: string;
  title: string;
  href?: string;
  type: string;
}
