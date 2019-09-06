import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Project, ProjectsService} from '../../services/crg/projects.service';
import {DataSchemaService} from '../../services/crg/data-schema.service';

@Component({
  selector: 'crg-projects-list',
  templateUrl: './projects-list@simf.component.html',
  styleUrls: ['./projects-list@simf.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor (private ruleService: DataSchemaService,
                private projectsService: ProjectsService){ }

  ngOnInit() {
    this.ruleService.getFeaturesDefinition().subscribe();
    this.projectsService.fetchProjects();

    this.projectsService.projects$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((projects: Project[]) => {
          this.projectsService.openProject(projects[0]);
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
