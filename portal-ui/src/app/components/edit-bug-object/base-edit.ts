import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { EditedField, FeatureDescription } from '../../services/crg/schema.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { FeaturePropertyValidators, ValidationError } from '../../services/util/FeaturePropertyValidators';

type Properties = { [key: string]: string };

export class BaseEdit implements OnDestroy {
  editFeatureForm: FormGroup;
  editFeatureData: EditedField[] = [];

  protected featureDescription: FeatureDescription;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    openLayersService.clearDraft();
  }

  getActualValuesFromForm(): Properties {
    return this.getDirtyAndValidProperties().reduce((newProperties: Properties, item) => {
      newProperties[item.name] = this.editFeatureForm.controls[item.name].value;

      return newProperties;
    }, {});
  }

  getDirtyAndValidProperties(): EditedField[] {
    const result: EditedField[] = [];
    if (!this.editFeatureForm.dirty) {
      return result;
    }

    this.editFeatureData.forEach((property: EditedField) => {
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
