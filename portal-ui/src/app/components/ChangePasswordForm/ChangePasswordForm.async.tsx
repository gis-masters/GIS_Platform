import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { authService } from '../../services/auth/auth/auth.service';
import { route } from '../../stores/Route.store';
import { ChangePasswordData, ChangePasswordFormForm } from './Form/ChangePasswordForm-Form';
import { ChangePasswordFormSuccess } from './Success/ChangePasswordForm-Success';
import { ChangePasswordFormTokenExpired } from './TokenExpired/ChangePasswordForm-TokenExpired';

import '!style-loader!css-loader!sass-loader!./ChangePasswordForm.scss';
import '!style-loader!css-loader!sass-loader!../HomePageForm/HomePageForm.scss';

const cnChangePasswordForm = cn('ChangePasswordForm');

@observer
export default class ChangePasswordForm extends Component {
  @observable private tokenExpired = false;
  @observable private successfullyChanged = false;
  @observable private loading = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.isTokenExpired();
  }

  render() {
    return (
      <div className={cnChangePasswordForm(null, ['HomePageForm'])}>
        {this.tokenExpired && <ChangePasswordFormTokenExpired />}
        {this.successfullyChanged && <ChangePasswordFormSuccess />}
        {!this.tokenExpired && !this.successfullyChanged && (
          <ChangePasswordFormForm loading={this.loading} actionFunction={this.savePassword} />
        )}
      </div>
    );
  }

  @boundMethod
  private async savePassword(value: ChangePasswordData) {
    this.setLoading(true);

    if (!value.password) {
      throw new Error('Пароль не может быть пустым');
    }

    try {
      await authService.changePassword(route.params.token, value.password);
      this.setSuccess();
    } catch (error) {
      const err = error as AxiosError<{
        errors?: Record<string, string>[];
        error_description?: string;
        message?: string;
      }>;
      const errors = err?.response?.data?.errors || [];

      if (errors.length > 0) {
        throw [{ field: 'password', messages: errors }];
      } else if (err.response?.data?.error_description) {
        throw [{ field: 'password', messages: [err.response?.data?.error_description] }];
      } else if (err.response?.data?.message) {
        throw [{ field: 'password', messages: [err.response?.data?.message] }];
      } else {
        throw [{ field: 'password', messages: ['Произошла ошибка'] }];
      }
    } finally {
      this.setLoading(false);
    }
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

    const token = pathname.at(-1);

    if (!token) {
      throw new Error('Токен не найден');
    }

    this.setTokenExpired(await authService.isTokenExpired(token));
  }

  @action
  private setSuccess() {
    this.successfullyChanged = true;
  }
}
