import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';
import { cloneDeep } from 'lodash';

import { PropertyType, Schema } from '../../services/data/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { usersService } from '../../services/data/users.service';
import { authService } from '../../services/auth.service';
import { services } from '../../services/services';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./ChangePasswordForm.scss';
import '!style-loader!css-loader!sass-loader!../HomePageForm/HomePageForm.scss';

const cnChangePassword = cn('ChangePassword');

interface ChangePassword {
  passwordConfirmation?: string;
  password?: string;
}

const defaultData: ChangePassword = {
  password: '',
  passwordConfirmation: ''
};

const schema = {
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
      propertyType: PropertyType.STRING
    }
  ]
};

@observer
export default class ChangePasswordForm extends Component {
  @observable private formValue = cloneDeep(defaultData);
  @observable private passwordValidationError: string;
  @observable private serverError: string;
  @observable private loading: boolean;
  @observable private tokenExpired: boolean;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.isTokenExpired();
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <div className={cnChangePassword(null, ['HomePageForm'])}>
        {this.tokenExpired && (
          <div className={cnChangePassword('TokenExpired')}>
            <div className={cnChangePassword('Message')}>Время действия ссылки на восстановление пароля истекло.</div>
            <Button className={cnChangePassword('Button')} href='/restore-password' color='primary'>
              Запросить новую ссылку для восстановления пароля
            </Button>
            <Button className={cnChangePassword('Button')} href='/'>
              Вернуться на главную страницу
            </Button>
          </div>
        )}

        {this.tokenExpired === false && (
          <Form<Partial<ChangePassword>>
            id={htmlId}
            className={cnChangePassword('Form')}
            schema={schema as unknown as Schema}
            value={this.formValue}
            auto
            labelInTextField
            actionFunction={this.savePassword}
            actions={
              <div className={cnChangePassword('Actions')}>
                <Button disabled={this.loading} form={htmlId} type='submit' color='primary'>
                  Сохранить
                </Button>
              </div>
            }
          >
            <div className={cnChangePassword('Title')}>Создание нового пароля</div>
          </Form>
        )}
      </div>
    );
  }

  @boundMethod
  private async savePassword(value: ChangePassword) {
    if (value.password !== value.passwordConfirmation) {
      throw [{ field: 'passwordConfirmation', messages: ['Пароли не совпадают'] }];
    }

    this.setLoading(true);
    const pathname = location.pathname.split('/');

    try {
      const login = await authService.changePassword(value.password, pathname[pathname.length - 1]);
      const result = await authService.authenticate({ username: String(login), password: value.password });
      if (result.ok) {
        await usersService.fetchCurrentUser();
        services.ngZone.run(() => {
          void services.router.navigateByUrl('/projects');
        });
      }
      this.setLoading(false);
    } catch (error) {
      const err = error as AxiosError<{
        errors?: Record<string, string>[];
        error_description?: string;
        message?: string;
      }>;
      const errors = err.response?.data?.errors || [];

      if (errors.length > 0) {
        throw [{ field: 'password', messages: errors }];
      } else if (err.response?.data?.error_description) {
        throw [{ field: 'password', messages: [err.response?.data?.error_description] }];
      } else if (err.response?.data?.message) {
        throw [{ field: 'password', messages: [err.response?.data?.message] }];
      } else {
        throw [{ field: 'password', messages: ['Произошла ошибка'] }];
      }
    }

    this.setLoading(false);
  }

  @action.bound
  private setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @action.bound
  private setTokenExpired(tokenExpired: boolean) {
    this.tokenExpired = tokenExpired;
  }

  private async isTokenExpired() {
    const pathname = location.pathname.split('/');

    try {
      await authService.checkIsTokenExpired(pathname[pathname.length - 1]);

      this.setTokenExpired(false);
    } catch (error) {
      const err = error as AxiosError;

      this.setTokenExpired(Number(err.status) === 404);
    }
  }

  private get errors() {
    if (this.passwordValidationError || this.serverError) {
      return [{ field: 'passwordConfirmation', messages: [this.passwordValidationError || this.serverError] }];
    }
  }
}
