import { Component, Input, OnInit } from '@angular/core';

import { BugObject, ViolationItem } from '../../../services/crg/validation.service';
import { dataSchemaService } from '../../../services/crg/data-schema.service';
import { ValidationError } from '../../../services/util/FeaturePropertyValidators';

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
  @Input() layerName: string;

  violationItems: ViolationViewItem[] = [];

  ngOnInit() {
    this.data.propertyViolations.forEach((value: ViolationItem) => {
      this.violationItems.push({
        errors: dataSchemaService.getErrorsDescription(value.errorTypes),
        propertyName: dataSchemaService.getPropertyAlias(this.layerName, value.name)
      });
    });

    this.data.objectViolations.forEach((validationError: ValidationError) => {
      this.violationItems.push({
        propertyName: dataSchemaService.getPropertyAlias(this.layerName, validationError.attribute),
        errors: [validationError.error]
      });
    });
  }
}
