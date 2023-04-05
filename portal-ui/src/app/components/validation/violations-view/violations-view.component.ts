import { Component, Input, OnInit } from '@angular/core';

import { BugObject } from '../../../services/data/validation/validation.models';
import { schemaService } from '../../../services/data/schema/schema.service';
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
  @Input() data: BugObject;
  @Input() layer: CrgVectorLayer;

  violationItems: ViolationViewItem[] = [];

  ngOnInit() {
    this.data.propertyViolations.forEach(async value => {
      this.violationItems.push({
        errors: schemaService.getErrorsDescription(value.errorTypes),
        propertyName: await schemaService.getPropertyAlias(this.layer, value.name)
      });
    });

    this.data.objectViolations.forEach(async validationError => {
      this.violationItems.push({
        propertyName: await schemaService.getPropertyAlias(this.layer, validationError.attribute),
        errors: [validationError.error]
      });
    });
  }
}
