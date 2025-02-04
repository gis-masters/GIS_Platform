import { Component, Input, OnInit } from '@angular/core';

import { schemaService } from '../../../services/data/schema/schema.service';
import { BugObject } from '../../../services/data/validation/validation.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';

interface ViolationViewItem {
  propertyName: string;
  errors: string[];
}

@Component({
  selector: 'crg-violations-view',
  templateUrl: './violations-view.component.html',
  styleUrls: ['./violations-view.component.css']
})
export class ViolationsViewComponent implements OnInit {
  @Input() data?: BugObject;
  @Input() layer?: CrgVectorLayer;

  violationItems: ViolationViewItem[] = [];

  async ngOnInit() {
    if (!this.layer) {
      throw new Error('Не указан слой');
    }

    for (const value of this.data?.propertyViolations || []) {
      this.violationItems.push({
        errors: schemaService.getErrorsDescription(value.errorTypes),
        propertyName: await schemaService.getPropertyAlias(this.layer, value.name)
      });
    }

    for (const validationError of this.data?.objectViolations || []) {
      this.violationItems.push({
        propertyName: await schemaService.getPropertyAlias(this.layer, validationError.attribute),
        errors: [validationError.error]
      });
    }
  }
}
