import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { PropertySchema } from '../../../services/crg/schema.models';
import { NewDataset } from '../../../services/data.service';
import { FieldErrors } from '../../../services/crg/formValidation.service';

import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';

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
