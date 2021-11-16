import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { FieldErrors } from '../../../services/crg/formValidation.service';
import { PropertySchema } from '../../../services/crg/schema.models';
import { generateRandomId } from '../../../services/util/randomId';

import { FormField } from '../Field/Form-Field';
import { FormLabel } from '../Label/Form-Label';
import { FormControl } from '../Control/Form-Control.composed';
import { FormHiddenField } from '../HiddenField/Form-HiddenField';
import { FormView } from '../View/Form-View.composed';

const cnFormContent = cn('Form', 'Content');

interface FormContentProps<T extends Record<string, unknown>> extends IClassNameProps {
  fields?: PropertySchema<T>[];
  formValue: T;
  errors?: FieldErrors[];
  onFormChange?: (changedValue: T) => void;
  onFieldChange?: (value: T[keyof T], propertyName: keyof T) => void;
  onFieldNeedValidate?: (value: T[keyof T], propertyName: keyof T) => void;
  readonly?: boolean;
}

@observer
export class FormContent<T extends Record<string, unknown> = Record<string, unknown>> extends Component<
  FormContentProps<T>
> {
  render() {
    const { fields, formValue, className, errors = [], readonly } = this.props;

    return (
      <div className={cnFormContent(null, [className])}>
        {fields.map((propertySchema: PropertySchema, i) => {
          const htmlId = 'formField_' + generateRandomId();

          if (propertySchema.hidden) {
            return (
              <FormHiddenField key={i} name={String(propertySchema.name)} value={formValue[propertySchema.name]} />
            );
          }

          return (
            <FormField key={i}>
              <FormLabel htmlFor={htmlId} required={propertySchema.required}>
                {propertySchema.title}
              </FormLabel>
              {readonly ? (
                <FormView
                  property={propertySchema}
                  type={propertySchema.propertyType}
                  fieldValue={formValue[propertySchema.name]}
                  errors={errors
                    .filter(({ field }) => field === propertySchema.name)
                    .flatMap(({ messages }) => messages)}
                  FormView={FormView}
                />
              ) : (
                <FormControl
                  htmlId={htmlId}
                  property={propertySchema}
                  type={propertySchema.propertyType}
                  onChange={this.fieldChangeHandler}
                  onNeedValidate={this.fieldNeedValidateHandler}
                  fieldValue={formValue[propertySchema.name]}
                  FormControl={FormControl}
                  errors={errors
                    .filter(({ field }) => field === propertySchema.name)
                    .flatMap(({ messages }) => messages)}
                >
                  {formValue[propertySchema.name]}
                </FormControl>
              )}
            </FormField>
          );
        })}
      </div>
    );
  }

  @boundMethod
  private fieldChangeHandler({ value, propertyName }: { value: T[keyof T]; propertyName: keyof T }) {
    const { formValue, onFormChange, onFieldChange } = this.props;

    if (onFormChange) {
      const newFormValue = cloneDeep(formValue);
      newFormValue[propertyName] = value;
      onFormChange(newFormValue);
    }

    if (onFieldChange) {
      onFieldChange(value, propertyName);
    }
  }

  @boundMethod
  private fieldNeedValidateHandler({ value, propertyName }: { value: T[keyof T]; propertyName: keyof T }) {
    const { onFieldNeedValidate } = this.props;

    if (onFieldNeedValidate) {
      onFieldNeedValidate(value, propertyName);
    }
  }
}
