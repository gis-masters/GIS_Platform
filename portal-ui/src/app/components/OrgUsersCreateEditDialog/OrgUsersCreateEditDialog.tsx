import React, { Component, ChangeEvent } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogActions, TextField, Checkbox, FormHelperText } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';

import { usersService, NewUserData, CrgUser } from '../../services/crg/users.service';
import { Form, FormField, FormLabel, FormControl } from '../Form/Form';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { getPatch } from '../../services/util/patch';

type ErrorFields = { [key in keyof NewUserData]: string };

import '!style-loader!css-loader!sass-loader!./OrgUsersCreateEditDialog.scss';

const cnOrgUsersCreateEditDialog = cn('OrgUsersCreateEditDialog');

const defaultErrors: ErrorFields = {
  email: '',
  name: '',
  surname: '',
  login: '',
  enabled: '',
  password: ''
};

const defaultValues: NewUserData = {
  email: '',
  name: '',
  surname: '',
  login: '',
  enabled: true,
  password: ''
};

interface OrgUsersCreateEditDialogProps {
  open: boolean;
  onClose: () => void;
  user?: CrgUser;
}

@observer
export class OrgUsersCreateEditDialog extends Component<OrgUsersCreateEditDialogProps> {
  @observable private locked = false;
  @observable private userData: NewUserData | CrgUser;
  @observable private errorFields: ErrorFields = cloneDeep(defaultErrors);

  constructor(props: OrgUsersCreateEditDialogProps) {
    super(props);

    this.setInfo();
  }

  render() {
    const { open, onClose, user } = this.props;
    const { email, name, surname, password, enabled } = this.userData;

    return (
      <>
        <Dialog open={open} onClose={onClose} PaperProps={{ className: cnOrgUsersCreateEditDialog() }}>
          <DialogContent>
            <Form onSubmit={this.create}>
              <FormField>
                <FormLabel htmlFor='permissionUserEmail'>E-mail:</FormLabel>
                <FormControl>
                  <TextField
                    disabled={Boolean(user)}
                    inputMode='email'
                    id='permissionUserEmail'
                    onChange={this.handleEmail}
                    value={email}
                    error={Boolean(this.errorFields.email)}
                    helperText={this.errorFields.email}
                    fullWidth
                    variant='standard'
                  />
                </FormControl>
              </FormField>
              <FormField>
                <FormLabel htmlFor='permissionUserName'>Имя:</FormLabel>
                <FormControl>
                  <TextField
                    id='permissionUserName'
                    onChange={this.handleName}
                    value={name}
                    error={Boolean(this.errorFields.name)}
                    helperText={this.errorFields.name}
                    fullWidth
                    variant='standard'
                  />
                </FormControl>
              </FormField>
              <FormField>
                <FormLabel htmlFor='permissionUserSurname'>Фамилия:</FormLabel>
                <FormControl>
                  <TextField
                    id='permissionUserSurname'
                    onChange={this.handleSurname}
                    value={surname}
                    error={Boolean(this.errorFields.surname)}
                    helperText={this.errorFields.surname}
                    fullWidth
                    variant='standard'
                  />
                </FormControl>
              </FormField>
              <FormField>
                <FormLabel htmlFor='permissionUserEnabled'>Активен:</FormLabel>
                <FormControl>
                  <Checkbox id='permissionUserEnabled' onChange={this.handleEnabled} checked={enabled} />
                  <FormHelperText error>{this.errorFields.enabled}</FormHelperText>
                </FormControl>
              </FormField>
              {!user && (
                <FormField>
                  <FormLabel htmlFor='permissionUserPassword'>Пароль:</FormLabel>
                  <FormControl>
                    <TextField
                      type='password'
                      id='permissionUserPassword'
                      onChange={this.handlePassword}
                      value={password}
                      error={Boolean(this.errorFields.password)}
                      helperText={this.errorFields.password}
                      fullWidth
                      variant='standard'
                    />
                  </FormControl>
                </FormField>
              )}
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={!user ? this.create : this.edit} color='primary'>
              {!user ? 'Создать' : 'Обновить'}
            </Button>
            <Button onClick={onClose}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <Loading global visible={this.locked} />
      </>
    );
  }

  @boundMethod
  private async create() {
    this.lock();

    try {
      await usersService.create(this.userData);
    } catch (error) {
      this.unlock();
      this.handleErrors(error);

      return;
    }
    this.props.onClose();
    this.setInfo();
    this.unlock();
  }

  @boundMethod
  private async edit() {
    const { user } = this.props;
    this.lock();

    try {
      await usersService.edit(getPatch(this.userData, user), user.id);
    } catch (error) {
      this.unlock();
      this.handleErrors(error);

      return;
    }

    this.props.onClose();
    this.unlock();
  }

  @action.bound
  private handleErrors(err: AxiosError<{ errors: Record<string, string>[] }>) {
    this.errorFields = cloneDeep(defaultErrors);
    const errors = err?.response?.data?.errors || [];
    errors.forEach((fieldError: { [key: string]: string }) => {
      if (fieldError.field) {
        this.errorFields[fieldError.field] = fieldError.defaultMessage || 'ошибка';
      }
    });
  }

  @action.bound
  private handleEmail(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.email = '';
    this.userData.email = e.target.value;
    this.userData.login = e.target.value;
  }

  @action.bound
  private handleName(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.name = '';
    this.userData.name = e.target.value;
  }

  @action.bound
  private handleSurname(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.surname = '';
    this.userData.surname = e.target.value;
  }

  @action.bound
  private handlePassword(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.password = '';
    this.userData.password = e.target.value;
  }

  @action.bound
  private handleEnabled(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.enabled = '';
    this.userData.enabled = e.target.checked;
  }

  @action
  private lock() {
    this.locked = true;
  }

  @action
  private unlock() {
    this.locked = false;
  }

  @action
  private setInfo() {
    this.userData = this.props.user ? cloneDeep(this.props.user) : cloneDeep(defaultValues);
    this.errorFields = cloneDeep(defaultErrors);
  }
}
