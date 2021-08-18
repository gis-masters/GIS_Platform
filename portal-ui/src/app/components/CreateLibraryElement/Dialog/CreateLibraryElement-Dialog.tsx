import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, observable } from 'mobx';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { FeatureDescription, ValueType } from '../../../services/crg/schema.models';
import { LibraryRecordRaw } from '../../../services/crg/doc-library.service';
import { services } from '../../../services/services';
import { sleep } from '../../../services/util/sleep';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';
import { Form, FormErrors } from '../../Form/Form';
import { convertSchema } from '../../../services/crg/schema.utils';

const cnCreateLibraryElementDialog = cn('CreateLibraryElement', 'Dialog');

export interface ExplorerCreateElementDialogProps {
  schema?: FeatureDescription;
  open: boolean;
  loading: boolean;
  formErrors?: FormErrors[];
  onClose: () => void;
  onCreate: (formValue: LibraryRecordRaw) => void;
}

@observer
export class CreateLibraryElementDialog extends React.Component<ExplorerCreateElementDialogProps> {
  @observable private formValue: LibraryRecordRaw = {};

  componentDidMount() {
    this.setFormValue(this.initialFormValue);
  }

  render() {
    const { open, loading, schema, formErrors } = this.props;

    return (
      <>
        {schema && (
          <Dialog maxWidth={'md'} open={open} onClose={this.closeDialog}>
            <DialogTitle>Создание нового элемента</DialogTitle>

            <DialogContent className={cnCreateLibraryElementDialog()}>
              <Form
                id='createLibraryElementForm'
                fields={convertSchema(schema.properties)}
                formValue={this.formValue}
                onFormChange={this.formChanged}
                onFormSubmit={this.formSubmitHandler}
                formErrors={formErrors}
              />
              <Loading visible={loading} />
            </DialogContent>

            <DialogActions>
              <Button form='createLibraryElementForm' type='submit' color='primary' disabled={false}>
                Создать
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  // TODO: убрать эту наркоманию
  @computed
  private get initialFormValue(): LibraryRecordRaw {
    const initialFormValue: Record<string, unknown> = {};
    (this.props.schema?.properties || []).forEach(property => {
      switch (property.valueType) {
        case ValueType.STRING: {
          initialFormValue[property.name] = '';
          break;
        }
        case ValueType.INT: {
          initialFormValue[property.name] = '';
          break;
        }
        case ValueType.CHOICE: {
          initialFormValue[property.name] = property.enumerations[0].value;
          break;
        }
        default: {
          initialFormValue[property.name] = '';
          services.logger.warn('Unsupported valueType: ' + property.valueType);
        }
      }
    });

    return initialFormValue;
  }

  @boundMethod
  private async formSubmitHandler(formValue: LibraryRecordRaw) {
    this.props.onCreate(formValue);
    await sleep(0);
    this.setFormValue(this.initialFormValue);
  }

  @boundMethod
  private formChanged(formValue: LibraryRecordRaw) {
    this.setFormValue(formValue);
  }

  @boundMethod
  private closeDialog() {
    this.props.onClose();
    this.setFormValue(this.initialFormValue);
  }

  @action
  private setFormValue(formValue: LibraryRecordRaw) {
    this.formValue = formValue;
  }
}
