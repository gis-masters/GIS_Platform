import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import {
  FieldErrors,
  getDefaultValues,
  normalizeServerErrors,
  validateFormValue
} from '../../services/crg/formValidation.service';
import { createDataset, dataEntitySchema, NewDataset } from '../../services/data.service';

import { CreateDatasetElementDialog } from './Dialog/CreateDatasetElement-Dialog';
import { CreateDatasetElementButton } from './Button/CreateDatasetElement-Button';

@observer
export class CreateDatasetElement extends Component {
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;
  @observable private formErrors?: FieldErrors[];
  @observable private serverFormErrors?: FieldErrors[];
  @observable private formValue: Partial<NewDataset> = {};

  render() {
    return (
      <>
        <CreateDatasetElementButton onClick={this.openDialog} />

        <CreateDatasetElementDialog
          open={this.dialogOpen}
          formValue={this.formValue}
          loading={this.dialogLoading}
          schema={dataEntitySchema}
          onClose={this.closeDialog}
          onCreate={this.create}
          onChange={this.setFormValue}
          formErrors={[...(this.serverFormErrors || []), ...(this.formErrors || [])]}
          onFieldChange={this.formFieldChanged}
          onFieldNeedValidate={this.formFieldValidateHandler}
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    this.setDialogLoading(false);
    this.setErrors([]);
    this.setServerErrors([]);
    this.setFormValue(getDefaultValues(dataEntitySchema.properties));
  }

  @action
  private setDialogLoading(loading: boolean) {
    this.dialogLoading = loading;
  }

  @boundMethod
  private async create(formValue: NewDataset) {
    this.setDialogLoading(true);
    if (this.formErrors?.length) {
      return;
    }

    try {
      await createDataset(formValue);
      this.closeDialog();
    } catch (error) {
      const err = error as AxiosError<{ errors?: FieldErrors[] }>;

      if (err?.response?.data?.errors) {
        this.setServerErrors(normalizeServerErrors(err.response.data.errors));
      }
    }

    this.setDialogLoading(false);
  }

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
  }

  @boundMethod
  private formFieldValidateHandler(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
    this.setErrors(validateFormValue(this.formValue, dataEntitySchema.properties));
  }

  @action
  private setErrors(errors: FieldErrors[] = []) {
    this.formErrors = errors.filter(({ messages }) => messages?.length);
  }

  @action
  private setServerErrors(errors: FieldErrors[]) {
    this.serverFormErrors = errors;
  }

  @action.bound
  private setFormValue(formValue: Partial<NewDataset>) {
    this.formValue = formValue;
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.formErrors?.filter(({ field }) => field !== fieldName));
    this.setServerErrors(this.serverFormErrors?.filter(({ field }) => field !== fieldName));
  }
}
