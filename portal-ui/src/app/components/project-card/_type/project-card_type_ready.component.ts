import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Project, ProjectsService } from '../../../services/crg/projects.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'crg-project-card_type_ready',
  templateUrl: './project-card_type_ready.component.html',
  styleUrls: ['./project-card_type_ready.component.scss']
})
export class ProjectCardTypeReadyComponent {
  @Input() project: Project;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor (private dialog: MatDialog,
              private projectsService: ProjectsService) {}

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
        .afterClosed().subscribe(result => {
          if (result) {
            this.projectsService.delete(this.project.id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(() => this.projectsService.fetchProjects());
          }
        });
  }
}
