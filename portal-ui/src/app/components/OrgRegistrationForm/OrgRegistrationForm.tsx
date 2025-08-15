import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isError } from 'lodash';

import { SpecializationView } from '../../../server-types/common-contracts';
import { RegData } from '../../services/auth/auth/auth.models';
import { authService } from '../../services/auth/auth/auth.service';
import { getSpecializations } from '../../services/auth/specializations/specializations.service';
import { PropertyOption, PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { services } from '../../services/services';
import { generateRandomId } from '../../services/util/randomId';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { Loading } from '../Loading/Loading';
import { SmartCaptchaControl } from '../SmartCaptchaControl/SmartCaptchaControl';
import { SpecializationDescription } from '../SpecializationDescription/SpecializationDescription';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./OrgRegistrationForm.scss';

const cnOrgRegistrationForm = cn('OrgRegistrationForm');

const defaultData: Partial<RegData> = {
  company: '',
  contactPhone: '',
  description: '',
  specializationId: undefined,
  lastName: '',
  firstName: '',
  email: '',
  password: '',
  password_: ''
};

@observer
export class OrgRegistrationForm extends Component {
  @observable private loading = false;
  @observable private specializations: SpecializationView[] = [];

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    this.setLoading(true);

    try {
      this.specializations = await getSpecializations();
    } catch (error) {
      Toast.error({
        message: isError(error) ? error?.message : 'Ошибка'
      });
    } finally {
      this.setLoading(false);
    }
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <div className={cnOrgRegistrationForm('Wrapper')}>
        <div className={cnOrgRegistrationForm('Title')}>Данные об организации</div>

        <Form
          className={cnOrgRegistrationForm(null, ['scroll'])}
          schema={this.schema}
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

        {this.loading && <Loading global />}
      </div>
    );
  }

  @computed
  private get schema(): SimpleSchema {
    return {
      properties: [
        {
          name: 'company',
          title: 'Наименование',
          minLength: 5,
          required: true,
          propertyType: PropertyType.STRING
        },
        {
          name: 'specializationId',
          title: 'Специализация',
          required: true,
          propertyType: PropertyType.CHOICE,
          options: this.getOptionsBySpecializations()
        },
        {
          name: 'specDescription',
          title: 'Описание специализации ',
          hidden: true,
          propertyType: PropertyType.CUSTOM,
          description: 'Something about this specialization',
          tags: ['KPT', 'Library'],
          ControlComponent: SpecializationDescription,
          dynamicPropertyFormula: (obj: unknown) => {
            if (!isRecordStringUnknown(obj)) {
              throw new Error('Некорректное значение');
            }

            if (obj.specialization && this.specializations?.length) {
              const specialization = this.specializations.find(({ id }) => obj.specialization === id);

              if (!specialization) {
                throw new Error('Отсутствуют данные о специализации');
              }

              const { description, settings } = specialization;

              return { hidden: false, description, settings };
            }

            return { ...obj };
          }
        },
        {
          name: 'contactPhone',
          title: 'Контактный телефон',
          required: true,
          display: 'phone',
          propertyType: PropertyType.STRING
        },
        {
          name: 'description',
          title: 'Описание',
          maxLength: 2000,
          display: 'multiline',
          propertyType: PropertyType.STRING
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
        },
        {
          propertyType: PropertyType.CUSTOM,
          name: 'captcha',
          title: 'Каптча',
          required: true,
          ControlComponent: SmartCaptchaControl
        }
      ]
    };
  }

  private getOptionsBySpecializations(): PropertyOption[] {
    if (!this.specializations?.length) {
      return [];
    }

    return this.specializations.map(({ title, id }) => ({ title, value: id }));
  }

  @boundMethod
  private async save(value: RegData) {
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

  @action
  private setLoading(loading: boolean): void {
    this.loading = loading;
  }
}
