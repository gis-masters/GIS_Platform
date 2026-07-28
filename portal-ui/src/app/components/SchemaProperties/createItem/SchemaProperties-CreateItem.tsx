import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import {
  type BasePropertySchema,
  type PropertySchema,
  PropertyType
} from '../../../services/data/schema/schema.models';
import { type FieldErrors } from '../../../services/util/form/formValidation.utils';
import { Button } from '../../Button/Button';
import { getPropertyFieldsSchema } from '../../EditPropertySchemaForm/EditPropertySchemaForm';
import { Form } from '../../Form/Form';
import { getTypeIcon } from '../Item/SchemaProperties-Item';

import './SchemaProperties-CreateItem.scss';

interface SchemaPropertiesCreateItemProps {
  open: boolean;
  onClose(): void;
  onCreate(property: PropertySchema): boolean;
  existingProperties: PropertySchema[];
}

const cnSchemaPropertiesCreateItem = cn('SchemaProperties', 'CreateItem');

@observer
export class SchemaPropertiesCreateItem extends Component<SchemaPropertiesCreateItemProps> {
  @observable private propertySchema: Partial<BasePropertySchema> = this.getDefaultPropertySchema();

  @observable
  private errors: FieldErrors[] = [];

  constructor(props: SchemaPropertiesCreateItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open } = this.props;
    const propertyType = this.propertySchema.propertyType ?? PropertyType.STRING;
    const hasErrors = this.errors.length > 0;
    const saveDisabled =
      !this.propertySchema.name?.trim() || !this.propertySchema.title?.trim() || !propertyType || hasErrors;
    const [TypeIcon, typeText] = getTypeIcon(propertyType);

    return (
      <Dialog className={cnSchemaPropertiesCreateItem()} open={open} onClose={this.close} fullWidth maxWidth='sm'>
        <DialogTitle>
          <span>Добавить свойство</span>

          <Tooltip title={typeText}>
            <TypeIcon color='action' />
          </Tooltip>
        </DialogTitle>

        <DialogContent>
          <Form<Partial<BasePropertySchema>>
            value={this.propertySchema}
            onFormChange={this.handleFormChange}
            schema={getPropertyFieldsSchema(propertyType, true)}
            errors={this.errors}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={this.create} color='primary' disabled={saveDisabled}>
            Создать
          </Button>

          <Button onClick={this.close}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private getDefaultPropertySchema(): Partial<BasePropertySchema> {
    return {
      name: '',
      title: '',
      propertyType: PropertyType.STRING
    };
  }

  private createPropertySchema(value: Partial<BasePropertySchema>): PropertySchema {
    const name = value.name?.trim() || '';
    const title = value.title?.trim() || '';

    const baseValue = {
      name,
      title,
      description: value.description,
      hidden: value.hidden,
      disabled: value.disabled,
      required: value.required,
      asTitle: value.asTitle,
      readOnly: value.readOnly,
      minWidth: value.minWidth,
      defaultWidth: value.defaultWidth,
      defaultValueFormula: value.defaultValueFormula,
      defaultValueWellKnownFormula: value.defaultValueWellKnownFormula,
      calculatedValueFormula: value.calculatedValueFormula,
      calculatedValueWellKnownFormula: value.calculatedValueWellKnownFormula,
      valueFormulaParams: value.valueFormulaParams,
      validationFormula: value.validationFormula,
      validationWellKnownFormula: value.validationWellKnownFormula,
      dynamicPropertyFormula: value.dynamicPropertyFormula
    };

    switch (value.propertyType) {
      case PropertyType.TEXT: {
        return {
          ...baseValue,
          propertyType: PropertyType.TEXT,
          defaultValue: typeof value.defaultValue === 'string' ? value.defaultValue : undefined
        };
      }

      case PropertyType.INT: {
        return {
          ...baseValue,
          propertyType: PropertyType.INT,
          defaultValue: typeof value.defaultValue === 'number' ? value.defaultValue : undefined
        };
      }

      case PropertyType.FLOAT: {
        return {
          ...baseValue,
          propertyType: PropertyType.FLOAT,
          defaultValue: typeof value.defaultValue === 'number' ? value.defaultValue : undefined
        };
      }

      case PropertyType.DATETIME: {
        return {
          ...baseValue,
          propertyType: PropertyType.DATETIME,
          defaultValue: typeof value.defaultValue === 'string' ? value.defaultValue : undefined
        };
      }

      case PropertyType.URL: {
        return {
          ...baseValue,
          propertyType: PropertyType.URL,
          defaultValue: typeof value.defaultValue === 'string' ? value.defaultValue : undefined
        };
      }

      case PropertyType.USER: {
        return {
          ...baseValue,
          propertyType: PropertyType.USER
        };
      }

      case PropertyType.BOOL: {
        return {
          ...baseValue,
          propertyType: PropertyType.BOOL,
          defaultValue: typeof value.defaultValue === 'boolean' ? value.defaultValue : undefined
        };
      }

      default: {
        return {
          ...baseValue,
          propertyType: PropertyType.STRING,
          defaultValue: typeof value.defaultValue === 'string' ? value.defaultValue : undefined
        };
      }
    }
  }

  @action.bound
  private reset() {
    this.propertySchema = this.getDefaultPropertySchema();
  }

  @action.bound
  private close() {
    this.reset();
    this.props.onClose();
  }

  @action.bound
  private create() {
    this.validateCreateForm(this.propertySchema);

    if (this.errors.length) {
      return;
    }

    if (!this.propertySchema.name?.trim() || !this.propertySchema.title?.trim()) {
      return;
    }

    const created = this.props.onCreate(this.createPropertySchema(this.propertySchema));

    if (created) {
      this.close();
    }
  }

  @boundMethod
  private handleFormChange(value: Partial<BasePropertySchema>) {
    const nextValue = { ...value };

    if (value.propertyType && value.propertyType !== this.propertySchema.propertyType && 'defaultValue' in nextValue) {
      delete nextValue.defaultValue;
    }

    this.propertySchema = nextValue;

    this.validateCreateForm(nextValue);
  }

  @action.bound
  private validateCreateForm(value: Partial<BasePropertySchema>) {
    this.errors = [
      ...this.getNameValidationErrors(value.name),
      ...this.getDuplicateNameErrors(value.name),
      ...this.getRequiredOptionErrors(value)
    ];
  }

  private getDuplicateNameErrors(name?: string): FieldErrors[] {
    const normalizedName = name?.trim().toLowerCase();

    if (
      normalizedName &&
      this.props.existingProperties.some(property => property.name.trim().toLowerCase() === normalizedName)
    ) {
      return [
        {
          field: 'name',
          messages: ['Свойство с таким именем уже существует']
        }
      ];
    }

    return [];
  }

  private getRequiredOptionErrors(value: Partial<BasePropertySchema>): FieldErrors[] {
    const errors: FieldErrors[] = [];

    if (value.required && value.hidden) {
      errors.push({
        field: 'hidden',
        messages: ['Обязательное поле не может быть скрытым']
      });
    }

    if (value.required && value.readOnly) {
      errors.push({
        field: 'readOnly',
        messages: ['Обязательное поле не может быть только для чтения']
      });
    }

    return errors;
  }

  private getNameValidationErrors(name?: string): FieldErrors[] {
    if (name && !/^[a-z]\w*$/i.test(name)) {
      return [
        {
          field: 'name',
          messages: ['Только строчные латинские буквы, цифры и "_". Первый символ должен быть буквой.']
        }
      ];
    }

    return [];
  }
}
