import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { EditedField, OldSchema } from '../../services/crg/schemaOld.models';
import { mapService } from '../../services/map/map.service';
import { FeaturePropertyValidators, ValidationError } from '../../services/util/FeaturePropertyValidators';

type Properties = { [key: string]: string };

export class BaseEdit implements OnDestroy {
  editFeatureForm: FormGroup;
  editFeatureData: EditedField[] = [];

  protected featureDescription: OldSchema;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    mapService.clearDraft();
  }

  getActualValuesFromForm(): Properties {
    // eslint-disable-next-line unicorn/prefer-object-from-entries
    return this.getDirtyAndValidProperties().reduce((newProperties: Properties, item) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  validateCustomRules(featureProperties: { [key: string]: any }): void {
    if (!this.featureDescription) {
      return;
    }

    FeaturePropertyValidators.validateCustomRules(
      featureProperties,
      this.featureDescription.customRuleFunction,
      this.featureDescription.tableName
    ).forEach((validationError: ValidationError) => {
      const control = this.editFeatureForm.controls[validationError.attribute];
      if (control) {
        control.setErrors([validationError.error]);
      }
    });
  }
}
