import React, { Component, ChangeEvent } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';
import { Dialog, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { GroupAdd } from '@material-ui/icons';
import { HttpErrorResponse } from '@angular/common/http';
import { boundMethod } from 'autobind-decorator';

import { NewGroupData, groupsService } from '../../../services/crg/groups.service';
import { Form, FormField, FormLabel, FormControl } from '../../Form/Form';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./OrgGroups-Create.scss';

const cnOrgGroups = cn('OrgGroups', 'Create');

type ErrorFields = { [key in keyof NewGroupData]: string };

const defaultValue: NewGroupData = {
  name: ''
};

@observer
export class OrgGroupsCreate extends Component {
  @observable private locked = false;
  @observable private dialogOpen = false;
  @observable private groupData: NewGroupData = cloneDeep(defaultValue);
  @observable private errorFields: ErrorFields = cloneDeep(defaultValue);

  render() {
    const { name, description } = this.groupData;

    return (
      <>
        <Button
          className={cnOrgGroups()}
          startIcon={<GroupAdd />}
          onClick={this.openDialog}
          variant='text'
        >
          Создать группу
        </Button>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogContent>
            <Form onSubmit={this.create}>
              <FormField>
                <FormLabel htmlFor='permissionGroupName'>Название группы:</FormLabel>
                <FormControl>
                  <TextField
                    id='permissionGroupName'
                    onChange={this.handleName}
                    value={name}
                    error={Boolean(this.errorFields.name)}
                    helperText={this.errorFields.name}
                  />
                </FormControl>
              </FormField>
              <FormField>
                <FormLabel htmlFor='permissionGroupDescription'>Описание:</FormLabel>
                <FormControl>
                  <TextField
                    id='permissionGroupDescription'
                    onChange={this.handleDescription}
                    value={description || ''}
                    error={Boolean(this.errorFields.description)}
                    helperText={this.errorFields.description}
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
      await groupsService.create(this.groupData);
    } catch (e) {
      this.unlock();
      this.handleErrors(e);
      return;
    }

    this.closeDialog();
    this.unlock();
  }

  @action.bound
  private handleErrors(err: HttpErrorResponse) {
    this.errorFields = cloneDeep(defaultValue);
    err.error &&
      err.error.errors &&
      err.error.errors.forEach((fieldError: { [key: string]: string }) => {
        if (fieldError.field) {
          this.errorFields[fieldError.field] = fieldError.defaultMessage || 'ошибка';
        }
      });
  }

  @action.bound
  private handleName(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.name = '';
    this.groupData.name = e.target.value;
  }

  @action.bound
  private handleDescription(e: ChangeEvent<HTMLInputElement>) {
    this.errorFields.description = '';
    this.groupData.description = e.target.value || undefined;
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
    this.groupData = cloneDeep(defaultValue);
    this.errorFields = cloneDeep(defaultValue);
  }
}
