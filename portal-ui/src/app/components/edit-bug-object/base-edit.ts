import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { EditFeatureItem, FeatureDescription } from '../../services/crg/data-schema.service';
import { FeaturePropertyValidators, ValidationError } from '../../services/util/FeaturePropertyValidators';

export class BaseEdit implements OnDestroy {
  editFeatureForm: FormGroup;
  editFeatureData: EditFeatureItem[] = [];

  protected featureDescription: FeatureDescription;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getActualValuesFromForm(propCopy): {[key: string]: string} {
    const newProperties: {[key: string]: string} = {};

    // Сохраняем только те свойства что были затронуты пользователем и валидны
    // Можно заморочится и смотреть что данные не просто затронуты но и не изменились
    const dirtyProperties: EditFeatureItem[] = this.getDirtyAndValidProperties();
    if (dirtyProperties) {
      dirtyProperties.forEach((item: EditFeatureItem) => {
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
        propCopy[item.name] = this.editFeatureForm.controls[item.name].value;
      });
    }

    return newProperties;
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
