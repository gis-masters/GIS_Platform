import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { EditFeatureItem, FeatureDescription } from '../../services/crg/data-schema.service';
import { FeaturePropertyValidators, ValidationError } from '../../services/util/FeaturePropertyValidators';

type Properties = { [key: string]: string };

export class BaseEdit implements OnDestroy {
  editFeatureForm: FormGroup;
  editFeatureData: EditFeatureItem[] = [];

  protected featureDescription: FeatureDescription;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getActualValuesFromForm(): Properties {
    return this.getDirtyAndValidProperties().reduce((newProperties: Properties, item) => {
      newProperties[item.name] = this.editFeatureForm.controls[item.name].value;

      return newProperties;
    }, {});
  }

  getDirtyAndValidProperties(): EditFeatureItem[] {
    const result: EditFeatureItem[] = [];
    if (!this.editFeatureForm.dirty) {
      return result;
    }

    this.editFeatureData.forEach((property: EditFeatureItem) => {
      const formProperty = this.editFeatureForm.controls[property.name];
      if (formProperty.dirty && formProperty.valid) {
        result.push(property);
      }
    });

    return result;
  }

  validateCustomRules(featureProperties: {}) {
    if (!this.featureDescription) {
      return;
    }

    FeaturePropertyValidators.validateCustomRules(featureProperties, this.featureDescription.customRuleFunction)
      .forEach((validationError: ValidationError) => {
        const control = this.editFeatureForm.controls[validationError.attribute];
        if (control) {
          control.setErrors([validationError.error]);
        }
      });
  }
}
