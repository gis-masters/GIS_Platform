import {filter} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NameHrefProjection} from '../../../services/geoserver/projections';
import {GeoWorkspace, WorkspacesService} from '../../../services/geoserver/workspaces.service';

export interface CrgProject {
  name: string;
  title: string;
  href?: string;
  type: string;
}

@Component({
  selector: 'crg-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  isEditMode = false;
  projects: CrgProject[] = [];
  projectName = '';
  isHover = true;
  activeProject: string;

  constructor(private logger: NGXLogger,
              private workspaceService: WorkspacesService) {

  }

  ngOnInit() {
    this.workspaceService.getAll()
      .pipe(filter(value => !!value['workspaces']))
      .subscribe((geoWorkspace: GeoWorkspace) => {
        this.logger.info('workspacesService.getAll: ', geoWorkspace.workspaces);

        geoWorkspace.workspaces.workspace
        // Не показываем 'scratch workspace'
          .filter((wItem: NameHrefProjection) => !wItem.name.includes(environment.scratchWorkspaceName))
          .forEach((wItem: NameHrefProjection) => {
            this.projects.push({
              name: wItem.name,
              title: '',
              href: wItem.href,
              type: ''
            });
          });
      });
  }

  openProject(project: CrgProject) {
    this.logger.info('open project: ', project);
  }

  createNew(event) {
    event.stopPropagation();

    this.isEditMode = false;

    this.workspaceService.create(this.projectName)
        .subscribe(response => {
          this.logger.info('rrrrrrrrrrrrrrrr', response);
        });
  }

  cancel(event) {
    event.stopPropagation();

    this.isEditMode = false;
  }

  switchMode() {
    this.isEditMode = true;
    this.projectName = '';
  }

  deleteProject(pItem: CrgProject) {
    this.workspaceService.delete(pItem.name)
        .subscribe(response => {
          this.logger.info('dddddddddddddd', response);
        });
  }

  hoverBy(pItem: CrgProject) {
    this.activeProject = pItem.name;
  }

  stopHover() {
    this.activeProject = '';
  }
}
