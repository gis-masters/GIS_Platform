import { UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { EditedField, OldSchema } from '../../services/data/schema/schemaOld.models';
import { FeaturePropertyValidators, ValidationError } from '../../services/util/FeaturePropertyValidators';

type Properties = { [key: string]: string };

export class BaseEdit {
  editFeatureForm?: UntypedFormGroup;
  editFeatureData: EditedField[] = [];

  protected featureDescription?: OldSchema;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  getActualValuesFromForm(): Properties {
    return this.getDirtyProperties().reduce((newProperties: Properties, item) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newProperties[item.name] = this.editFeatureForm?.controls[item.name].value;

      return newProperties;
    }, {});
  }

  getDirtyProperties(): EditedField[] {
    const result: EditedField[] = [];
    if (!this.editFeatureForm?.dirty) {
      return result;
    }

    this.editFeatureData.forEach((property: EditedField) => {
      const formProperty = this.editFeatureForm?.controls[property.name];

      if (formProperty?.dirty) {
        result.push(property);
      }
    });

    return result;
  }

  validateCustomRules(featureProperties: { [key: string]: unknown }): void {
    if (!this.featureDescription) {
      return;
    }

    FeaturePropertyValidators.validateCustomRules(
      featureProperties,
      this.featureDescription.customRuleFunction,
      this.featureDescription.tableName
    ).forEach((validationError: ValidationError) => {
      const control = this.editFeatureForm?.controls[validationError.attribute];
      if (control) {
        control.setErrors([validationError.error]);
      }
    });
  }
}
