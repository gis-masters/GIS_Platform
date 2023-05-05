import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PropertySchema, PropertyType, SimpleSchema } from '../../../services/data/schema/schema.models';
import { generateRandomId } from '../../../services/util/randomId';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';

import { ChangePasswordFormTitle } from '../Title/ChangePasswordForm-Title';

const cnChangePasswordFormForm = cn('ChangePasswordForm', 'Form');

export interface ChangePasswordData {
  passwordConfirmation?: string;
  password?: string;
}

const schema: SimpleSchema = {
  properties: [
    {
      name: 'password',
      title: 'Пароль',
      required: true,
      display: 'password',
      propertyType: PropertyType.STRING
    },
    {
      name: 'passwordConfirmation',
      title: 'Подтверждение пароля',
      required: true,
      display: 'password',
      propertyType: PropertyType.STRING,
      validationFormula(passwordConfirmation: string, property: PropertySchema, { password }: ChangePasswordData) {
        if (passwordConfirmation !== password) {
          return ['Пароли не совпадают'];
        }
      }
    }
  ]
};

interface ChangePasswordFormFormProps {
  loading: boolean;
  actionFunction(value: ChangePasswordData): Promise<void>;
}

export const ChangePasswordFormForm: FC<ChangePasswordFormFormProps> = ({ actionFunction, loading }) => {
  const htmlId = generateRandomId();

  return (
    <Form<Partial<ChangePasswordData>>
      className={cnChangePasswordFormForm()}
      id={htmlId}
      schema={schema}
      auto
      labelInTextField
      actionFunction={actionFunction}
      actions={
        <Button disabled={loading} form={htmlId} type='submit' color='primary'>
          Сохранить
        </Button>
      }
    >
      <ChangePasswordFormTitle>Создание нового пароля</ChangePasswordFormTitle>
    </Form>
  );
};
