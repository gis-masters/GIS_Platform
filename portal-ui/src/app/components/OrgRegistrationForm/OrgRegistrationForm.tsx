import React, { Component } from 'react';
import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Form } from '../Form/Form';
import { Toast } from '../Toast/Toast';
import { Button } from '../Button/Button';
import { services } from '../../services/services';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { generateRandomId } from '../../services/util/randomId';
import { authService } from '../../services/auth/auth/auth.service';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';

import '!style-loader!css-loader!sass-loader!./OrgRegistrationForm.scss';

const cnOrgRegistrationForm = cn('OrgRegistrationForm');

const schema: SimpleSchema = {
  properties: [
    {
      name: 'company',
      title: 'Наименование',
      minLength: 5,
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'contactPhone',
      title: 'Контактный телефон',
      required: true,
      display: 'phone',
      propertyType: PropertyType.STRING
    },
    {
      name: 'specialization',
      title: 'Специализация',
      required: true,
      propertyType: PropertyType.CHOICE,
      options: [
        {
          title: 'НТО',
          value: 'НТО,Фотослой'
        },
        {
          title: 'ГИСОГД',
          value: 'ГИСОГД,Фотослой,КПТ'
        }
      ]
    },
    {
      name: 'lastName',
      title: 'Фамилия',
      maxLength: 100,
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'firstName',
      title: 'Имя',
      maxLength: 50,
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'email',
      title: 'E-mail',
      required: true,
      display: 'email',
      propertyType: PropertyType.STRING
    },
    {
      name: 'password',
      title: 'Пароль',
      required: true,
      display: 'password',
      propertyType: PropertyType.STRING
    },
    {
      name: 'password_',
      title: 'Подтверждение пароля',
      required: true,
      display: 'password',
      propertyType: PropertyType.STRING
    }
  ]
};

interface OrgRegistration {
  company: string;
  contactPhone: string;
  specialization: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  password_: string;
}

const defaultData: OrgRegistration = {
  company: '',
  contactPhone: '',
  specialization: null,
  lastName: '',
  firstName: '',
  email: '',
  password: '',
  password_: ''
};

@observer
export class OrgRegistrationForm extends Component {
  @observable private loading = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <>
        <div className={cnOrgRegistrationForm('Title')}>Данные об организации</div>
        <Form
          className={cnOrgRegistrationForm()}
          schema={schema}
          id={htmlId}
          value={defaultData}
          auto
          labelInField
          actionFunction={this.save}
          actions={
            <ActionsLeft>
              <Button form={htmlId} type='submit' color='primary'>
                Зарегистрироваться
              </Button>
            </ActionsLeft>
          }
        />
      </>
    );
  }

  @boundMethod
  private async save(value: OrgRegistration) {
    if (value.password !== value.password_) {
      throw new Error('Пароли не совпадают');
    }

    await authService.registration(value);
    Toast.success('Регистрация прошла успешно');

    this.toLoginPage();
  }

  @boundMethod
  private toLoginPage() {
    services.ngZone.run(() => {
      void services.router.navigateByUrl('/');
    });
  }
}
