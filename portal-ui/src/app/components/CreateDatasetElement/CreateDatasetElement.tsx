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
import { communicationService } from '../../services/communication.service';
import { PropertyType, PropertySchema } from '../../services/crg/schema.models';
import { createDataset, NewDataset } from '../../services/data.service';

import { ExplorerStore } from '../Explorer/Explorer.store';

import { CreateDatasetElementDialog } from './Dialog/CreateDatasetElement-Dialog';
import { CreateDatasetElementButton } from './Button/CreateDatasetElement-Button';

export interface CreateDatasetElementProps {
  store: ExplorerStore;
  path?: string;
}

@observer
export class CreateDatasetElement extends Component<CreateDatasetElementProps> {
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;
  @observable private formErrors?: FieldErrors[];
  @observable private serverFormErrors?: FieldErrors[];
  @observable private formValue: Partial<NewDataset> = {};
  @observable private fields: PropertySchema<NewDataset>[] = [
    {
      propertyType: PropertyType.STRING,
      title: 'Название набора данных',
      name: 'title',
      required: true
    },
    {
      propertyType: PropertyType.STRING,
      title: 'Описание набора данных',
      name: 'details'
    }
  ];

  render() {
    return (
      <>
        <CreateDatasetElementButton onClick={this.openDialog} />

        <CreateDatasetElementDialog
          open={this.dialogOpen}
          formValue={this.formValue}
          loading={this.dialogLoading}
          fields={this.fields}
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
    this.setFormValue(getDefaultValues(this.fields));
  }

  @action
  private setDialogLoading(loading: boolean) {
    this.dialogLoading = loading;
  }

  @boundMethod
  private async create(formValue: NewDataset) {
    if (this.formErrors?.length) {
      return;
    }

    try {
      await createDataset(formValue.title, formValue.details);

      communicationService.libraryItemsUpdated.emit();
      this.closeDialog();
    } catch (error) {
      const err = error as AxiosError<{ errors?: FieldErrors[] }>;

      if (err?.response?.data?.errors) {
        this.setServerErrors(normalizeServerErrors(err.response.data.errors));
      }
    }
  }

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
  }

  @boundMethod
  private formFieldValidateHandler(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
    this.setErrors(validateFormValue(this.formValue, this.fields));
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
