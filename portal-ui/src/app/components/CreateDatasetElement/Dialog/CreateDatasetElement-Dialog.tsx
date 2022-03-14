import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';

import { NewDataset } from '../../../services/data.service';
import { PropertySchema } from '../../../services/crg/schema.models';
import { FieldErrors } from '../../../services/crg/formValidation.service';

import { Button } from '../../Button/Button';

export interface CreateDatasetElementDialogProps {
  fields?: PropertySchema[];
  open: boolean;
  loading: boolean;
  formValue: Partial<NewDataset>;
  formErrors?: FieldErrors[];
  onClose(): void;
  onCreate(formValue: Partial<NewDataset>): void;
  onChange(formValue: Partial<NewDataset>): void;
  onFieldChange: (value: Partial<NewDataset>[keyof Partial<NewDataset>], propertyName: string) => void;
  onFieldNeedValidate: (value: Partial<NewDataset>[keyof Partial<NewDataset>], propertyName: string) => void;
}

export const CreateDatasetElementDialog: FC<CreateDatasetElementDialogProps> = observer(
  ({
    open,
    loading,
    fields,
    formValue,
    formErrors,
    onFieldChange,
    onFieldNeedValidate,
    onCreate,
    onChange,
    onClose
  }) => (
    <>
      <Dialog maxWidth={'md'} open={open} onClose={onClose}>
        <DialogTitle>Создание нового набора данных</DialogTitle>
        <DialogContent>
          <RegistryConsumer id='common'>
            {({ Form }) => (
              <Form<Partial<NewDataset>>
                id='createDatasetForm'
                fields={fields}
                value={formValue}
                onFormChange={onChange}
                onFormSubmit={onCreate}
                onFieldChange={onFieldChange}
                onFieldNeedValidate={onFieldNeedValidate}
                errors={formErrors}
              />
            )}
          </RegistryConsumer>
        </DialogContent>
        <DialogActions>
          <Button loading={loading} form='createDatasetForm' type='submit' color='primary'>
            Создать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </>
  )
);
