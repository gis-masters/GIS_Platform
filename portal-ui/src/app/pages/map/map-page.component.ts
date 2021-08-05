import { Component, OnInit } from '@angular/core';

import { communicationService } from '../../services/communication.service';
import { projectsService } from '../../services/crg/projects.service';

@Component({
  selector: 'crg-map-page',
  templateUrl: './map-page.component.html'
})
export class MapPageComponent implements OnInit {
  async ngOnInit() {
    await projectsService.fetchCurrent();
    communicationService.mapInited.emit(true);
  }
}
