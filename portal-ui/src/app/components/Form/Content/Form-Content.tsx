import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { PropertySchema, PropertyType, Schema, SimpleSchema } from '../../../services/data/schema/schema.models';
import { getFieldRelations } from '../../../services/data/schema/schema.utils';
import { FieldErrors } from '../../../services/util/form/formValidation.utils';
import { generateRandomId } from '../../../services/util/randomId';
import { isStringArray } from '../../../services/util/typeGuards/isStringArray';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { RelationsButton } from '../../RelationsButton/RelationsButton';
import { FormControl } from '../Control/Form-Control.composed';
import { FormField } from '../Field/Form-Field';
import { FormRole } from '../Form.async';
import { applyFieldValue, convertToComplexField } from '../Form.utils';
import { FormHiddenField } from '../HiddenField/Form-HiddenField';
import { FormLabel } from '../Label/Form-Label';
import { FormView } from '../View/Form-View.composed';

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
      <div className={cnFormContent(null, [className, 'scroll'])}>
        {schema.properties.map((propertySchema: PropertySchema, i) => {
          const htmlId = 'formField_' + generateRandomId();
          const relations = getFieldRelations(propertySchema.name, schema);

          if (propertySchema.hidden) {
            return (
              <FormHiddenField
                key={i}
                name={String(propertySchema.name)}
                // TODO: пофиксить непонятную ошибку типизации
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
                  labelInField={labelInField}
                  errors={isStringArray(propertyErrors) ? propertyErrors : undefined}
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
                  errors={isStringArray(propertyErrors) ? propertyErrors : undefined}
                >
                  {/* TODO: пофиксить непонятную ошибку типизации */}
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
    const propertySchema: PropertySchema | undefined = schema.properties.find(({ name }) => name === propertyName);
    const prevValue = formValue[propertyName];

    if (onFormChange && propertySchema) {
      const newFormValue = cloneDeep(applyFieldValue<T>(propertySchema, formValue, value));
      onFormChange(newFormValue);
    }

    if (onFieldChange && prevValue) {
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
