import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Project, ProjectsService } from '../../../services/crg/projects.service';
import { cn } from '../../../services/util/cn';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'crg-project-card_type_ready',
  templateUrl: './project-card_type_ready.component.html',
  styleUrls: ['./project-card_type_ready.component.scss']
})
export class ProjectCardTypeReadyComponent implements OnInit {
  @Input() project: Project;

  link: string;
  cn = cn('project-card');

  constructor (private dialog: MatDialog,
              private projectsService: ProjectsService) {}

  ngOnInit () {
    this.link = this.projectsService.getProjectUrl(this.project);
  }

  openProject() {
    this.projectsService.openProject(this.project);
  }

  openDeleteDialog(): void {
    const data: ConfirmDialogData = {
      title: 'Вы действительно хотите удалить проект?',
      approveBtnName: 'Удалить'
    };

    this.dialog
        .open(ConfirmDialogComponent, {width: '400px', data: data})
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.projectsService.delete(this.project.id);
          }
        });
  }
}
