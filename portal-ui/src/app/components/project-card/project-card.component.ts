import { Component, Input } from '@angular/core';

import { Project } from '../../services/crg/projects.service';

@Component({
  selector: 'crg-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() type?: 'add' | 'loading' | 'ready';
  @Input() project: Project;
}
