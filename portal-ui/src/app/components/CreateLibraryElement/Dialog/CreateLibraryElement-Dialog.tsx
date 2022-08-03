import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { LibraryRecordRaw } from '../../../services/data/doc-library.service';
import { FieldErrors } from '../../../services/formValidation.service';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';
import { Schema } from '../../../services/data/schema.models';

const cnCreateLibraryElementDialog = cn('CreateLibraryElement', 'Dialog');

export interface ExplorerCreateElementDialogProps {
  schema?: Schema;
  open: boolean;
  loading: boolean;
  formValue: LibraryRecordRaw;
  formErrors?: FieldErrors[];
  onClose(): void;
  onCreate(formValue: LibraryRecordRaw): void;
  onChange(formValue: LibraryRecordRaw): void;
  onFieldChange: (
    value: LibraryRecordRaw[keyof LibraryRecordRaw],
    propertyName: string,
    prevValue: LibraryRecordRaw[keyof LibraryRecordRaw]
  ) => void;
  onFieldNeedValidate: (value: LibraryRecordRaw[keyof LibraryRecordRaw], propertyName: string) => void;
}

@observer
export class CreateLibraryElementDialog extends React.Component<ExplorerCreateElementDialogProps> {
  render() {
    const { open, loading, schema, formValue, formErrors, onFieldChange, onFieldNeedValidate } = this.props;

    return (
      <>
        {schema && (
          <Dialog fullWidth maxWidth='md' open={open} onClose={this.closeDialog}>
            <DialogTitle>Создание нового элемента</DialogTitle>

            <DialogContent className={cnCreateLibraryElementDialog()}>
              <Form<LibraryRecordRaw>
                id='createLibraryElementForm'
                schema={schema}
                value={formValue}
                onFormChange={this.formChanged}
                onFormSubmit={this.formSubmitHandler}
                onFieldChange={onFieldChange}
                onFieldNeedValidate={onFieldNeedValidate}
                errors={formErrors}
              />
            </DialogContent>

            <DialogActions>
              <Button loading={loading} form='createLibraryElementForm' type='submit' color='primary' disabled={false}>
                Создать
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @boundMethod
  private formSubmitHandler(formValue: LibraryRecordRaw) {
    const { onCreate } = this.props;
    onCreate(formValue);
  }

  @boundMethod
  private formChanged(formValue: LibraryRecordRaw) {
    const { onChange } = this.props;
    onChange(formValue);
  }

  @boundMethod
  private closeDialog() {
    this.props.onClose();
  }
}
