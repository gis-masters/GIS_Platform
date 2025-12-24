import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isError } from 'lodash';

import { type SpecializationView } from '../../../server-types/common-contracts';
import { type RegData } from '../../services/auth/auth/auth.models';
import { authService } from '../../services/auth/auth/auth.service';
import { getSpecializations } from '../../services/auth/specializations/specializations.service';
import { type PropertyOption, PropertyType, type SimpleSchema } from '../../services/data/schema/schema.models';
import { environment } from '../../services/environment';
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

import './OrgRegistrationForm.scss';

const cnOrgRegistrationForm = cn('OrgRegistrationForm');

const getUrlParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get(param);
};

@observer
export class OrgRegistrationForm extends Component {
  @observable private loading = false;
  @observable private specializations: SpecializationView[] = [];
  @observable private defaultSpecializationId: number | undefined = undefined;
  @observable private isSpecializationReadOnly = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    this.setLoading(true);

    try {
      this.specializations = await getSpecializations();

      const urlSpecialization = getUrlParam('specialization');

      if (urlSpecialization && urlSpecialization.trim() !== '') {
        // проверка на существование специализации по id
        const specializationFromUrl = this.specializations.find(specialization => {
          return specialization.id === Number(urlSpecialization);
        });

        if (specializationFromUrl) {
          this.setDefaultSpecializationId(specializationFromUrl.id);
          this.setSpecializationReadOnly(true);
        }
      }
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

    const defaultData: Partial<RegData> = {
      company: '',
      contactPhone: '',
      description: '',
      specializationId: this.defaultSpecializationId || undefined,
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      password_: ''
    };

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
    let required = false;
    let hidden = true;

    if (environment.captcha.enabled) {
      required = true;
      hidden = false;
    }

    return {
      properties: [
        {
          name: 'specializationId',
          title: 'Специализация',
          required: true,
          readOnly: this.isSpecializationReadOnly,
          propertyType: PropertyType.CHOICE,
          options: this.getOptionsBySpecializations()
        },
        {
          name: 'company',
          title: 'Наименование',
          minLength: 5,
          required: true,
          propertyType: PropertyType.STRING
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
          required: required,
          hidden: hidden,
          ControlComponent: SmartCaptchaControl
        }
      ]
    };
  }

  @action
  private setDefaultSpecializationId(id: number): void {
    this.defaultSpecializationId = id;
  }

  @action
  private setSpecializationReadOnly(readOnly: boolean): void {
    this.isSpecializationReadOnly = readOnly;
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
    Toast.success(
      'Регистрация прошла успешно.\n' +
      'Подготовка данных для новой организации займет (3–10 минут).\n' +
      'Вход доступен, но для начала работы дождитесь создания проекта.'
    );

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
