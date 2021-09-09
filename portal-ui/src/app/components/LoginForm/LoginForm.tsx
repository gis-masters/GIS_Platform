import React, { ChangeEvent, Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { FormControl, TextField } from '@material-ui/core';

import { Form, FormField } from '../Form/Form';
import { Button } from '../Button/Button';
import { authService } from '../../services/auth.service';
import { communicationService } from '../../services/communication.service';
import { usersService } from '../../services/crg/users.service';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { Pages } from '../../app-routing.module';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./LoginForm.scss';

const cnLoginForm = cn('LoginForm');

interface LoginFormProps {
  inDialog?: boolean;
}

interface AuthUserData {
  username: string;
  password: string;
}

const defaultData: AuthUserData = {
  username: '',
  password: ''
};

@observer
export class LoginForm extends Component<LoginFormProps> {
  @observable private usernameError: string;
  @observable private passwordRecovery: string;
  @observable private isUserDisabled: boolean;
  @observable private isWrongPassword: boolean;
  @observable private userData: AuthUserData = cloneDeep(defaultData);
  @observable private loading: boolean;

  async componentDidMount() {
    if (route.data.page === Pages.LOGIN) {
      const user = await usersService.fetchCurrentUser(true);
      if (user?.id) {
        void services.router.navigateByUrl('/projects');
      }
    }
  }

  render() {
    return (
      <>
        {!this.loading ? (
          <Form className={cnLoginForm()} id='LoginForm' onSubmit={this.submitHandler}>
            <FormField>
              <FormControl fullWidth>
                <TextField
                  label='E-mail'
                  id='authUserEmail'
                  onChange={this.handleEmail}
                  value={this.userData.username}
                  error={Boolean(this.usernameError)}
                  helperText={this.usernameError}
                  required
                  fullWidth
                />
              </FormControl>
            </FormField>
            <FormField>
              <FormControl fullWidth>
                <TextField
                  label='Пароль'
                  id='authUserPassword'
                  onChange={this.handlePassword}
                  value={this.userData.password}
                  type='password'
                  required
                  fullWidth
                />
              </FormControl>
            </FormField>
            {this.isWrongPassword && <div className={cnLoginForm('Error')}>Неверное имя пользователя или пароль</div>}
            {this.isUserDisabled && (
              <div className={cnLoginForm('Error')}>Запрос на создание принят и обрабатывается. Попробуйте позже.</div>
            )}
            {this.passwordRecovery ? <div className={cnLoginForm('Recovery')}>{this.passwordRecovery}</div> : null}
            <div className={cnLoginForm('Actions')}>
              <Button form='LoginForm' type='submit' color='primary'>
                Войти
              </Button>
              <Button onClick={this.handlePasswordRecovery}>Забыли пароль?</Button>
            </div>
          </Form>
        ) : (
          <Loading visible={this.loading} />
        )}
      </>
    );
  }

  @action.bound
  private handleEmail(e: ChangeEvent<HTMLInputElement>) {
    this.usernameError = '';
    this.userData.username = e.target.value;
  }

  @action.bound
  private setUsernameError(message: string) {
    this.usernameError = message;
  }
  @action.bound
  private setUserDisabled(res: boolean) {
    this.isUserDisabled = res;
  }
  @action.bound
  private setWrongPassword(res: boolean) {
    this.isWrongPassword = res;
  }

  @action.bound
  private handlePassword(e: ChangeEvent<HTMLInputElement>) {
    this.userData.password = e.target.value;
  }

  @action.bound
  private handlePasswordRecovery() {
    this.passwordRecovery =
      'Отправьте заявку на восстановление пароля администратору ГИСОГД на почтовый адрес middel.erde@gmail.com';
  }

  @action.bound
  private handleLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @boundMethod
  private async submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.handleLoading(true);
    if (
      !this.userData.username.length ||
      !/^[\w!#$%&*+./=?^`{|}~’-]+@[\da-z-]+(?:\.[\da-z-]+)*$/i.test(this.userData.username)
    ) {
      this.setUsernameError('Пожалуйста введите корректный e-mail в формате name@domain');
    }

    if (this.usernameError) {
      this.handleLoading(false);

      return;
    }

    const result = await authService.authenticate(this.userData);
    this.handleLoading(false);
    if (result.ok) {
      if (this.props.inDialog) {
        communicationService.authDialogSuccess.emit();
      } else {
        await usersService.fetchCurrentUser();
        void services.router.navigateByUrl('/projects');
      }
    } else {
      this.setUserDisabled(result.userDisabled);
      this.setWrongPassword(result.wrongPassword);
    }
  }
}
