import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Project, ProjectsService} from '../../services/crg/projects.service';
import {ProcessStatus} from '../../services/crg/models';
import {DataSchemaService} from '../../services/crg/data-schema.service';
import {CommunicationService} from '../../services/communication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'crg-projects-list',
  templateUrl: './projects-list@conv.component.html',
  styleUrls: ['./projects-list@conv.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  areProjectsLoaded: boolean = false;

  pending = ProcessStatus.PENDING;
  done = ProcessStatus.DONE;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor (private ruleService: DataSchemaService,
                private projectsService: ProjectsService,
                private communicationService: CommunicationService) {
    this.communicationService.stepperEvents.emit(1);
  }

  ngOnInit() {
    this.ruleService.getFeaturesDefinition().subscribe();
    this.projectsService.fetchProjects();

    this.projectsService.projects$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((projects: Project[]) => {
          this.areProjectsLoaded = true;
          this.projects = projects;
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
