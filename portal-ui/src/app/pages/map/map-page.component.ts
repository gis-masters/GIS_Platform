import { Component, OnInit } from '@angular/core';

import { projectsService } from '../../services/crg/projects.service';
import { currentProject } from '../../stores/CurrentProject.store';

@Component({
  selector: 'crg-map-page',
  templateUrl: './map-page.component.html'
})
export class MapPageComponent implements OnInit {
  async ngOnInit() {
    await projectsService.fetchCurrent();
  }
}
