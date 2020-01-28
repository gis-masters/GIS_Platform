import { Component, OnInit } from '@angular/core';

import { ProjectsService } from '../../services/crg/projects.service';

@Component({
  selector: 'crg-map-page',
  templateUrl: './map-page.component.html'
})
export class MapPageComponent implements OnInit {
  projectName: string;

  constructor (private projectsService: ProjectsService) { }

  async ngOnInit() {
    const project = await this.projectsService.getCurrent();
    this.projectName = project.name;
  }
}
