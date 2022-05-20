import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { PropertySchema, PropertyType, Schema } from '../../../services/crg/schema.models';
import { FieldErrors } from '../../../services/crg/formValidation.service';
import { getFieldRelations } from '../../../services/crg/schema.utils';
import { generateRandomId } from '../../../services/util/randomId';
import { RelatedDocumentsButton } from '../../RelatedDocumentsButton/RelatedDocumentsButton';

import { applyFieldValue, convertToComplexField } from '../Form.utils';
import { FormHiddenField } from '../HiddenField/Form-HiddenField';
import { FormControl } from '../Control/Form-Control.composed';
import { FormView } from '../View/Form-View.composed';
import { FormField } from '../Field/Form-Field';
import { FormLabel } from '../Label/Form-Label';

import '!style-loader!css-loader!sass-loader!../Relations/Form-Relations.scss';

const cnFormContent = cn('Form', 'Content');
const cnFormRelations = cn('Form', 'Relations');

interface FormContentProps<T extends Record<string, unknown>> extends IClassNameProps {
  schema: Schema<T>;
  formValue: Partial<T>;
  errors?: FieldErrors[];
  onFormChange?: (changedValue: Partial<T>) => void;
  onFieldChange?: (value: T[keyof T], propertyName: keyof T, prevValue: T[keyof T]) => void;
  onFieldNeedValidate?: (value: T[keyof T], propertyName: keyof T) => void;
  readonly?: boolean;
}

@observer
export class FormContent<T extends Record<string, unknown> = Record<string, unknown>> extends Component<
  FormContentProps<T>
> {
  render() {
    const { schema, formValue, className, errors = [], readonly } = this.props;

    return (
      <div className={cnFormContent(null, [className])}>
        {schema.properties.map((propertySchema: PropertySchema, i) => {
          const htmlId = 'formField_' + generateRandomId();
          const relations = getFieldRelations(propertySchema.name, schema);

          if (propertySchema.hidden) {
            return (
              <FormHiddenField key={i} name={String(propertySchema.name)} value={formValue[propertySchema.name]} />
            );
          }

          if (propertySchema.propertyType === PropertyType.FILE && !organizationSettings.fileDownloadEnabled) {
            return;
          }

          return (
            <FormField key={i} withRelations={!!relations.length}>
              <FormLabel
                htmlFor={htmlId}
                required={propertySchema.required}
                readonly={readonly}
                description={propertySchema.description}
              >
                {propertySchema.title}
              </FormLabel>

              {readonly || propertySchema.readOnly ? (
                <FormView
                  property={propertySchema}
                  type={propertySchema.propertyType}
                  fieldValue={convertToComplexField(propertySchema, formValue)}
                  errors={errors
                    .filter(({ field }) => field === propertySchema.name)
                    .flatMap(({ messages }) => messages)}
                />
              ) : (
                <FormControl
                  htmlId={htmlId}
                  property={propertySchema}
                  type={propertySchema.propertyType}
                  onChange={this.fieldChangeHandler}
                  onNeedValidate={this.fieldNeedValidateHandler}
                  fieldValue={convertToComplexField(propertySchema, formValue)}
                  formValue={formValue}
                  errors={errors
                    .filter(({ field }) => field === propertySchema.name)
                    .flatMap(({ messages }) => messages)}
                >
                  {String(formValue[propertySchema.name])}
                </FormControl>
              )}

              {!!relations.length && (
                <RelatedDocumentsButton
                  className={cnFormRelations()}
                  obj={formValue}
                  relations={relations}
                  size='small'
                />
              )}
            </FormField>
          );
        })}
      </div>
    );
  }

  @boundMethod
  private fieldChangeHandler({ value, propertyName }: { value: T[keyof T]; propertyName: keyof T }) {
    const { formValue, onFormChange, onFieldChange, schema } = this.props;
    const propertySchema: PropertySchema<T> = schema.properties.find(({ name }) => name === propertyName);
    const prevValue = formValue[propertyName];

    if (onFormChange) {
      const newFormValue = cloneDeep(applyFieldValue<T>(propertySchema, formValue, value));
      onFormChange(newFormValue);
    }

    if (onFieldChange) {
      onFieldChange(value, propertyName, prevValue);
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
