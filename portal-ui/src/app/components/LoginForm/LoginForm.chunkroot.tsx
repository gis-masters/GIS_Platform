import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { type OrganizationsListItemInfo } from '../../services/auth/auth/auth.models';
import { authService } from '../../services/auth/auth/auth.service';
import { usersService } from '../../services/auth/users/users.service';
import { communicationService } from '../../services/communication.service';
import { services } from '../../services/services';
import { FormFieldErrorsError } from '../../services/util/form/FormFieldErrorsError';
import { isFieldErrors } from '../../services/util/form/formValidation.utils';
import { isArray } from '../../services/util/typeGuards/isArray';
import { isArrayOf } from '../../services/util/typeGuards/isArrayOf';
import { isAxiosError } from '../../services/util/typeGuards/isAxiosError';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { currentUser } from '../../stores/CurrentUser.store';
import { Pages, route } from '../../stores/Route.store';
import { Loading } from '../Loading/Loading';
import { LoginFormForm } from './Form/LoginForm-Form';
import { type AuthUserData } from './LoginForm.models';
import { LoginFormOrgSelect } from './OrgSelect/LoginForm-OrgSelect';

import './LoginForm.scss';
import '../HomePageForm/HomePageForm.scss';

const cnLoginForm = cn('LoginForm');

const defaultData: AuthUserData = {
  username: '',
  password: ''
};

function appendLoginErrorMessagesFromItem(messages: string[], item: unknown): void {
  if (typeof item === 'string') {
    messages.push(item);

    return;
  }
  if (isArray(item)) {
    for (const el of item) {
      if (typeof el === 'string') {
        messages.push(el);
      }
    }

    return;
  }
  if (isRecordStringUnknown(item)) {
    messages.push(...Object.values(item).filter((v): v is string => typeof v === 'string'));
  }
}

export interface LoginFormProps extends IClassNameProps {
  inDialog?: boolean;
  notShowEsiaIn?: boolean;
  notRightActions?: boolean;
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
    const queryParams: Record<string, string | null> = Object.fromEntries(url.searchParams);

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
    const { className, inDialog, notShowEsiaIn, notRightActions } = this.props;

    return (
      <div className={className || cnLoginForm({ inDialog }, ['HomePageForm'])}>
        {!this.organizations.length && (
          <LoginFormForm
            notShowEsiaIn={notShowEsiaIn}
            actionFunction={this.login}
            userData={this.userData}
            notRightActions={notRightActions}
          />
        )}

        {!!this.organizations.length && (
          <LoginFormOrgSelect
            organizations={this.organizations}
            onSelect={this.loginWithOrgId}
            onClose={this.dropOrganizations}
          />
        )}

        <Loading className={cnLoginForm('Loading')} visible={this.loading} />
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
        const rawErrorsRaw = isAxiosError<{ errors?: unknown }>(error) ? error.response?.data?.errors : undefined;
        if (isArrayOf(rawErrorsRaw, isFieldErrors)) {
          throw new FormFieldErrorsError(rawErrorsRaw);
        }
        const rawErrors: unknown[] = isArray(rawErrorsRaw) ? rawErrorsRaw : [];
        const messages: string[] = [];
        for (const item of rawErrors) {
          appendLoginErrorMessagesFromItem(messages, item);
        }
        throw new FormFieldErrorsError([{ field: 'username', messages }]);
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
      throw new FormFieldErrorsError([
        { field: 'password', messages: ['Запрос на создание принят и обрабатывается. Попробуйте позже'] }
      ]);
    } else if (result.wrongPassword) {
      throw new FormFieldErrorsError([{ field: 'password', messages: ['Неверное имя пользователя или пароль'] }]);
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
