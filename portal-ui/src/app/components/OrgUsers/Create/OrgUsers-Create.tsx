import React, { Component, ChangeEvent } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { PersonAdd, PersonAddOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';
import { AxiosError } from 'axios';

import { usersService, NewUserData } from '../../../services/crg/users.service';
import { Form, FormField, FormLabel, FormControl } from '../../Form/Form';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';

const cnOrgUsersCreate = cn('OrgUsers', 'Create');

type ErrorFields = { [key in keyof NewUserData]: string };

const defaultValue: ErrorFields = {
  email: '',
  name: '',
  surname: '',
  password: ''
};

@observer
export class OrgUsersCreate extends Component {
  @observable private locked = false;
  @observable private dialogOpen = false;
  @observable private userData: NewUserData = cloneDeep(defaultValue);
  @observable private errorFields: ErrorFields = cloneDeep(defaultValue);

  render() {
    const { email, name, surname, password } = this.userData;

    return (
      <>
        <Button
          className={cnOrgUsersCreate()}
          startIcon={this.dialogOpen ? <PersonAdd /> : <PersonAddOutlined />}
          onClick={this.openDialog}
          variant='text'
        >
          Создать пользователя
        </Button>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogContent>
            <Form onSubmit={this.create}>
              <FormField>
                <FormLabel htmlFor='permissionUserEmail'>E-mail:</FormLabel>
                <FormControl>
                  <TextField
                    inputMode='email'
                    id='permissionUserEmail'
                    onChange={this.handleEmail}
                    value={email}
                    error={Boolean(this.errorFields.email)}
                    helperText={this.errorFields.email}
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
                  />
                </FormControl>
              </FormField>
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
                  />
                </FormControl>
              </FormField>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.create} color='primary'>
              Создать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <Loading global={true} visible={this.locked} />
      </>
    );
  }

  @boundMethod
  private async create() {
    this.lock();

    try {
      await usersService.create(this.userData);
    } catch (e) {
      this.unlock();
      this.handleErrors(e);
      return;
    }

    this.closeDialog();
    this.unlock();
  }

  @action.bound
  private handleErrors(err: AxiosError) {
    this.errorFields = cloneDeep(defaultValue);
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
  private lock() {
    this.locked = true;
  }

  @action.bound
  private unlock() {
    this.locked = false;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    setTimeout(() => {
      this.reset();
    }, 500);
  }

  @action.bound
  private reset() {
    this.userData = cloneDeep(defaultValue);
    this.errorFields = cloneDeep(defaultValue);
  }
}
