import { Component } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Project, ProjectsService} from '../../../services/crg/projects.service';
import {Process, ProcessStatus} from '../../../services/crg/models';

@Component({
  selector: 'crg-project-card_type_add',
  templateUrl: './project-card_type_add.component.html',
  styleUrls: ['./project-card_type_add.component.scss']
})
export class ProjectCardTypeAddComponent {
  isEdit: boolean = false;
  newProjectError: string = '';

  addForm = this.fb.group({
    name: [null]
  });

  private cancelClicked: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  get newProjectName (): string {
    return this.addForm.value.name || '';
  };

  set newProjectName (value: string) {
    this.addForm.controls.name.setValue(value);
  };

  onClick () {
    if (!this.cancelClicked) {
      this.isEdit = true;
    }
    this.cancelClicked = false;

  }

  cancel() {
    this.newProjectName = '';
    this.newProjectError = '';
    this.isEdit = false;
    this.cancelClicked = true;
  }

  create() {
    this.projectsService
        .create(this.newProjectName)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((process: Process) => {
            this.isEdit = false;
            this.projectsService.fetchProjects();

            this.checkProjectStatus(process);
          },
          errors => {
            if (errors.error.status === 409) {
              this.newProjectError = errors.error.message;
            } else {
              this.newProjectError = 'Ошибка при создании проекта';
            }
          });

    this.newProjectName = '';
    this.newProjectError = '';
  }

  constructor (private projectsService: ProjectsService,
              private fb: FormBuilder) {}

  private checkProjectStatus(processResponse: Process) {
    const startTime = Date.now();
    const minute = 60000;
    const checkStatusInterval = setInterval(() => {
      if (startTime - Date.now() > minute) {
        clearInterval(checkStatusInterval);
      }

      this.projectsService.getById(processResponse.extra.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((project: Project) => {
            if (project.status === ProcessStatus.DONE) {
              this.projectsService.fetchProjects();
              clearInterval(checkStatusInterval);
            }
          });
    }, 2000);
  }
}
