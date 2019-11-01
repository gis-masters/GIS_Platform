import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnInit} from '@angular/core';
import {BugObject, ViolationItem} from '../../../services/crg/validation.service';
import {DataSchemaService} from '../../../services/crg/data-schema.service';
import {ValidationError} from '../../../services/util/FeaturePropertyValidators';

@Component({
  selector: 'crg-violations-view',
  templateUrl: './violations-view.component.html',
  styleUrls: ['./violations-view.component.css']
})
export class ViolationsViewComponent implements OnInit {

  @Input() data: BugObject;
  @Input() layerName: string;

  violationItems: ViolationViewItem[] = [];

  constructor(private logger: NGXLogger,
              private ruleService: DataSchemaService) {}

  ngOnInit() {
    this.data.propertyViolations.forEach((value: ViolationItem) => {
      this.violationItems.push({
        errors: this.ruleService.getErrorsDescription(value.errorTypes),
        propertyName: this.ruleService.getPropertyAlias(this.layerName, value.name)
      });
    });

    this.data.objectViolations.forEach((validationError: ValidationError) => {
      this.violationItems.push({
        propertyName: this.ruleService.getPropertyAlias(this.layerName, validationError.attribute),
        errors: [validationError.error]
      });
    });
  }
}

interface ViolationViewItem {
  propertyName: string;
  errors: string[];
}
