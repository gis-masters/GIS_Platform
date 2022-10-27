import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { env } from '../../stores/Env.store';
import { route, Pages } from '../../stores/Route.store';
import { communicationService } from '../../services/communication.service';
import { PropertyType, Schema } from '../../services/data/schema.models';
import { FieldErrors } from '../../services/formValidation.service';
import { usersService } from '../../services/data/users.service';
import { generateRandomId } from '../../services/util/randomId';
import { getEsiaUrl } from '../../services/server-urls.service';
import { authService } from '../../services/auth.service';
import { services } from '../../services/services';
import { http } from '../../services/http.service';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./LoginForm.scss';
import '!style-loader!css-loader!sass-loader!../HomePageForm/HomePageForm.scss';

const cnLoginForm = cn('LoginForm');

interface AuthUserData {
  username: string;
  password: string;
}

const defaultData: AuthUserData = {
  username: '',
  password: ''
};

const schema = {
  properties: [
    {
      name: 'username',
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
    }
  ]
};

export interface LoginFormProps {
  inDialog?: boolean;
}

@observer
export default class LoginForm extends Component<LoginFormProps> {
  @observable private userData: AuthUserData = cloneDeep(defaultData);
  @observable private loading: boolean;
  @observable private esiaLoading: boolean;
  @observable private errors: FieldErrors[] = [];

  constructor(props: LoginFormProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const url = new URL(location.href);
    const queryParams = Object.fromEntries(url.searchParams);

    const guestName = queryParams.guestName;
    const guestPass = queryParams.guestPass;

    if (guestName && guestPass) {
      this.setUserData(guestName, guestPass);
      await this.login({ username: guestName, password: guestPass });

      queryParams.guestName = null;
      queryParams.guestPass = null;

      await services.ngZone.run(async () => {
        await services.router.navigate([location.pathname], {
          queryParams,
          queryParamsHandling: 'merge'
        });
      });

      return;
    }

    if (route.data.page === Pages.LOGIN) {
      const user = await usersService.fetchCurrentUser(true);
      if (user?.id) {
        services.ngZone.run(() => {
          void services.router.navigateByUrl('/projects');
        });
      }
    }
  }

  render() {
    const { inDialog } = this.props;
    const htmlId = generateRandomId();

    return (
      <>
        {!this.loading ? (
          <Form<Partial<AuthUserData>>
            id={htmlId}
            className={cnLoginForm({ inDialog }, ['HomePageForm'])}
            schema={schema as unknown as Schema}
            value={this.userData}
            auto
            labelInTextField
            errors={this.errors}
            onFieldChange={this.formFieldChanged}
            actionFunction={this.login}
            actions={
              <div className={cnLoginForm('Actions')}>
                <span className={cnLoginForm('ActionsLeft')}>
                  <Button
                    className={cnLoginForm('ActionsLogin')}
                    form={htmlId}
                    type='submit'
                    color='primary'
                    disabled={this.esiaLoading}
                  >
                    Войти
                  </Button>
                  {!!env.esia?.length && (
                    <Button onClick={this.authWithEsia} loading={this.esiaLoading}>
                      Войти с помощью ГОСУСЛУГ
                    </Button>
                  )}
                </span>
                <Button href='/restore-password' disabled={this.esiaLoading}>
                  Восстановить пароль
                </Button>
              </div>
            }
          />
        ) : (
          <Loading visible={this.loading} />
        )}
      </>
    );
  }

  @action.bound
  private setUserData(username: string, password: string) {
    this.userData = {
      username,
      password
    };
  }

  @action.bound
  private async authWithEsia() {
    this.esiaLoading = true;

    window.location.href = await http.get<string>(await getEsiaUrl(), { cache: { disabled: true } });
  }

  @action.bound
  private handleLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @action
  private setError(errors: FieldErrors[] = []) {
    this.errors = errors;
  }

  @boundMethod
  private formFieldChanged() {
    this.setError();
  }

  @boundMethod
  private async login(value: AuthUserData) {
    this.handleLoading(true);

    const result = await authService.authenticate(value);
    this.handleLoading(false);

    try {
      if (result.ok) {
        if (this.props.inDialog) {
          communicationService.authDialogSuccess.emit();
        } else {
          await usersService.fetchCurrentUser();
          services.ngZone.run(() => {
            void services.router.navigateByUrl('/projects/default');
          });
        }
      } else if (result.userDisabled) {
        throw [{ field: 'password', messages: 'Запрос на создание принят и обрабатывается. Попробуйте позже' }];
      } else if (result.wrongPassword) {
        this.setError([
          { field: 'password', messages: ['Неверное имя пользователя или пароль'] },
          { field: 'username', messages: [''] }
        ]);

        throw [{ field: 'password', messages: 'Неверное имя пользователя или пароль' }];
      }
    } catch (error) {
      const err = error as AxiosError<{ errors?: Record<string, string>[] }>;
      throw err.response?.data?.errors || [];
    }
  }
}
