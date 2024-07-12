import { Component } from '@angular/core';

import { ImportDataHolderService, InputDataMetrics } from '../../services/geoserver/import/import-data-holder.service';

@Component({
  selector: 'crg-work-import-preview',
  templateUrl: './work-import-preview.component.html',
  styleUrls: ['./work-import-preview.component.scss']
})
export class WorkImportPreviewComponent {
  metrics?: InputDataMetrics;

  constructor(public importData: ImportDataHolderService) {
    this.importData.metrics$.subscribe((metrics: InputDataMetrics) => (this.metrics = metrics));
  }
}
