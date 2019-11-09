import { Component } from '@angular/core';

import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'crg-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.scss']
})
export class ImportPageComponent {
  constructor(private communicationService: CommunicationService) {
    this.communicationService.stepperEvents.emit(2);
  }
}
