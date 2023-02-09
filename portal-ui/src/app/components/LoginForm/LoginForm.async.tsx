import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { route, Pages } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { authService, OrganizationsListItemInfo } from '../../services/auth/auth.service';
import { communicationService } from '../../services/communication.service';
import { usersService } from '../../services/auth/users.service';
import { services } from '../../services/services';
import { Loading } from '../Loading/Loading';

import { LoginFormOrgSelect } from './OrgSelect/LoginForm-OrgSelect';
import { LoginFormForm } from './Form/LoginForm-Form';

import '!style-loader!css-loader!sass-loader!./LoginForm.scss';
import '!style-loader!css-loader!sass-loader!../HomePageForm/HomePageForm.scss';

const cnLoginForm = cn('LoginForm');

export interface AuthUserData {
  username: string;
  password: string;
  orgId?: number;
}

const defaultData: AuthUserData = {
  username: '',
  password: ''
};

export interface LoginFormProps {
  inDialog?: boolean;
}

@observer
export default class LoginForm extends Component<LoginFormProps> {
  @observable private userData: AuthUserData = { ...defaultData };
  @observable private loading = false;
  @observable private organizations: OrganizationsListItemInfo[] = [];

  constructor(props: LoginFormProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const url = new URL(location.href);
    const queryParams = Object.fromEntries(url.searchParams);

    const guestName = queryParams.guestName;
    const guestPass = queryParams.guestPass;
    const guestOrgId = queryParams.guestOrgId ? Number(queryParams.guestOrgId) : undefined;

    if (guestName && guestPass) {
      this.setUserData(guestName, guestPass);
      await this.login({ username: guestName, password: guestPass, orgId: guestOrgId });

      queryParams.guestName = null;
      queryParams.guestPass = null;
      queryParams.orgId = null;

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

    return (
      <div className={cnLoginForm({ inDialog }, ['HomePageForm'])}>
        {!this.organizations.length && <LoginFormForm actionFunction={this.login} userData={this.userData} />}

        {!!this.organizations.length && (
          <LoginFormOrgSelect
            organizations={this.organizations}
            onSelect={this.loginWithOrgId}
            onClose={this.dropOrganizations}
          />
        )}

        <Loading visible={this.loading} />
      </div>
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
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async login(value: AuthUserData) {
    this.setUserData(value.username, value.password);
    this.setLoading(true);
    const result = await authService.authenticate(value);
    this.setLoading(false);

    if (result.ok) {
      try {
        this.setLoading(true);
        await usersService.fetchCurrentUser();
      } catch (error) {
        const err = error as AxiosError<{ errors?: Record<string, string>[] }>;
        throw err.response?.data?.errors || [];
      } finally {
        this.setLoading(false);
      }

      if (currentUser.isSystemAdmin) {
        services.ngZone.run(() => {
          void services.router.navigateByUrl('/system-management');
        });

        if (this.props.inDialog) {
          communicationService.authDialogSuccess.emit();
        }

        return;
      }

      if (this.props.inDialog) {
        communicationService.authDialogSuccess.emit();
      } else {
        services.ngZone.run(() => {
          void services.router.navigateByUrl('/projects/default');
        });
      }
    } else if (result.userDisabled) {
      throw [{ field: 'password', messages: 'Запрос на создание принят и обрабатывается. Попробуйте позже' }];
    } else if (result.wrongPassword) {
      throw [{ field: 'password', messages: 'Неверное имя пользователя или пароль' }];
    } else if (result.organizations) {
      this.setOrganizations(result.organizations);
    }
  }

  @action
  private setOrganizations(organizations: OrganizationsListItemInfo[]) {
    this.organizations = organizations;
  }

  @boundMethod
  private dropOrganizations() {
    this.setOrganizations([]);
  }

  @boundMethod
  private async loginWithOrgId(orgId: number) {
    await this.login({ ...this.userData, orgId });
  }
}
