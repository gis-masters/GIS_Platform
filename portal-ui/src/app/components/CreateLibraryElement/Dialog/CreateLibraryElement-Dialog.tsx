import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { LibraryRecordRaw } from '../../../services/crg/doc-library.service';
import { FieldErrors } from '../../../services/crg/formValidation.service';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';
import { PropertySchema } from '../../../services/crg/schema.models';

const cnCreateLibraryElementDialog = cn('CreateLibraryElement', 'Dialog');

export interface ExplorerCreateElementDialogProps {
  fields?: PropertySchema[];
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
    const { open, loading, fields, formValue, formErrors, onFieldChange, onFieldNeedValidate } = this.props;

    return (
      <>
        {fields && (
          <Dialog maxWidth={'md'} open={open} onClose={this.closeDialog}>
            <DialogTitle>Создание нового элемента</DialogTitle>

            <DialogContent className={cnCreateLibraryElementDialog()}>
              <Form<LibraryRecordRaw>
                id='createLibraryElementForm'
                fields={fields}
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
