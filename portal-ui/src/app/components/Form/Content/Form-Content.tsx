import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { PropertySchema, PropertyType, Schema, SimpleSchema } from '../../../services/data/schema/schema.models';
import { FieldErrors } from '../../../services/util/form/formValidation.utils';
import { getFieldRelations } from '../../../services/data/schema/schema.utils';
import { generateRandomId } from '../../../services/util/randomId';
import { RelationsButton } from '../../RelationsButton/RelationsButton';

import { applyFieldValue, convertToComplexField } from '../Form.utils';
import { FormHiddenField } from '../HiddenField/Form-HiddenField';
import { FormControl } from '../Control/Form-Control.composed';
import { FormView } from '../View/Form-View.composed';
import { FormField } from '../Field/Form-Field';
import { FormLabel } from '../Label/Form-Label';
import { FormRole } from '../Form.async';

import '!style-loader!css-loader!sass-loader!../Relations/Form-Relations.scss';

const cnFormContent = cn('Form', 'Content');
const cnFormRelations = cn('Form', 'Relations');

interface FormContentProps<T> extends IClassNameProps {
  schema: Schema | SimpleSchema;
  formValue: Partial<T>;
  errors?: FieldErrors[];
  formRole?: FormRole;
  onFormChange?: (changedValue: Partial<T>) => void;
  onFieldChange?: (value: T[keyof T & string], propertyName: keyof T & string, prevValue: T[keyof T & string]) => void;
  onFieldNeedValidate?: (value: T[keyof T & string], propertyName: keyof T & string) => void;
  readonly?: boolean;
  labelInField?: boolean;
}

@observer
export class FormContent<T> extends Component<FormContentProps<T>> {
  render() {
    const { schema, formValue, className, formRole, errors = [], readonly, labelInField } = this.props;

    return (
      <div className={cnFormContent(null, [className])}>
        {schema.properties.map((propertySchema: PropertySchema, i) => {
          const htmlId = 'formField_' + generateRandomId();
          const relations = getFieldRelations(propertySchema.name, schema);

          if (propertySchema.hidden) {
            return (
              <FormHiddenField
                key={i}
                name={String(propertySchema.name)}
                value={formValue[propertySchema.name] as unknown}
              />
            );
          }

          if (propertySchema.propertyType === PropertyType.FILE && !organizationSettings.downloadFiles) {
            return;
          }

          const propertyReadonly = Boolean(readonly || propertySchema.readOnly);
          const propertyErrors = errors
            .filter(({ field }) => field === propertySchema.name)
            .flatMap(({ messages }) => messages);

          return (
            <FormField key={i} withRelations={!!relations.length}>
              {!labelInField && (
                <FormLabel
                  htmlFor={htmlId}
                  required={propertySchema.required}
                  readonly={readonly}
                  description={propertySchema.description}
                >
                  {propertySchema.title}
                </FormLabel>
              )}

              {propertyReadonly ? (
                <FormView
                  property={propertySchema}
                  formRole={formRole}
                  type={propertySchema.propertyType}
                  formValue={formValue}
                  fieldValue={convertToComplexField(propertySchema, formValue)}
                  errors={propertyErrors}
                />
              ) : (
                <FormControl
                  htmlId={htmlId}
                  property={propertySchema}
                  formRole={formRole}
                  type={propertySchema.propertyType}
                  onChange={this.fieldChangeHandler}
                  onNeedValidate={this.fieldNeedValidateHandler}
                  fieldValue={convertToComplexField(propertySchema, formValue)}
                  formValue={formValue}
                  labelInField={labelInField}
                  errors={propertyErrors}
                >
                  {String(formValue[propertySchema.name])}
                </FormControl>
              )}

              {!!relations.length && (
                <RelationsButton className={cnFormRelations()} obj={formValue} relations={relations} size='small' />
              )}
            </FormField>
          );
        })}
      </div>
    );
  }

  @boundMethod
  private fieldChangeHandler({ value, propertyName }: { value: T[keyof T & string]; propertyName: keyof T & string }) {
    const { formValue, onFormChange, onFieldChange, schema } = this.props;
    const propertySchema: PropertySchema = schema.properties.find(({ name }) => name === propertyName);
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
  private fieldNeedValidateHandler({
    value,
    propertyName
  }: {
    value: T[keyof T & string];
    propertyName: keyof T & string;
  }) {
    const { onFieldNeedValidate } = this.props;

    if (onFieldNeedValidate) {
      onFieldNeedValidate(value, propertyName);
    }
  }
}
