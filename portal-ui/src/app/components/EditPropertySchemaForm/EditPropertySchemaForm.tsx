import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import {
  BasePropertySchema,
  PropertySchema,
  PropertyType,
  SimpleSchema
} from '../../services/data/schema/schema.models';
import { Form } from '../Form/Form';

const cnEditPropertySchemaForm = cn('EditPropertySchemaForm');

const propertyFieldsSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title: 'Название',
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'readOnly',
      title: 'Только для чтения',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'required',
      title: 'Обязательное',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'hidden',
      title: 'Скрытое',
      propertyType: PropertyType.BOOL
    }
  ]
};

interface EditPropertySchemaFormProps {
  propertySchema: PropertySchema;
  propertySchemaWithoutContentType?: PropertySchema;
  onPropertyChange(newPropertySchema: Partial<BasePropertySchema>): void;
}

@observer
export class EditPropertySchemaForm extends Component<EditPropertySchemaFormProps> {
  render() {
    const { propertySchema } = this.props;

    return (
      <Form<Partial<BasePropertySchema>>
        className={cnEditPropertySchemaForm()}
        value={propertySchema}
        onFormChange={this.handleFormChange}
        schema={propertyFieldsSchema}
      />
    );
  }

  @boundMethod
  private handleFormChange(value: Partial<BasePropertySchema>) {
    const { onPropertyChange, propertySchemaWithoutContentType } = this.props;

    // чтобы не замусоривать схему дефолтными значениями, удалим их
    const cleanedValue = Object.fromEntries(
      // сейчас все дефолты false
      Object.entries(value).filter(([k, v]) => v || propertySchemaWithoutContentType?.[k as keyof PropertySchema])
    );

    onPropertyChange(cleanedValue);
  }
}
