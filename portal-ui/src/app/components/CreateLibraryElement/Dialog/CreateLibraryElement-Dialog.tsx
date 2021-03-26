import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, observable } from 'mobx';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { FeatureDescription, FieldType } from '../../../services/crg/schema.models';
import { LibraryItem } from '../../../services/crg/doc-library.service';
import { services } from '../../../services/services';
import { sleep } from '../../../services/util/sleep';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';

const cnCreateLibraryElementDialog = cn('CreateLibraryElement', 'Dialog');

export interface ExplorerCreateElementDialogProps {
  schema?: FeatureDescription;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (formValue: LibraryItem) => void;
}

@observer
export class CreateLibraryElementDialog extends React.Component<ExplorerCreateElementDialogProps> {
  @observable private formValue: Partial<LibraryItem> = {};

  componentDidMount() {
    this.setFormValue(this.initialFormValue);
  }

  render() {
    const { open, loading, schema } = this.props;

    return (
      <>
        {schema && (
          <Dialog disableBackdropClick={true} maxWidth={'md'} open={open} onClose={this.closeDialog}>
            <DialogTitle>Создание нового элемента</DialogTitle>

            <DialogContent className={cnCreateLibraryElementDialog()}>
              <Form
                id='createLibraryElementForm'
                schema={schema}
                formValue={this.formValue}
                onFormChange={this.formChanged}
                onFormSubmit={this.formSubmitHandler}
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
  private get initialFormValue(): Partial<LibraryItem> {
    const initialFormValue = {};
    (this.props.schema?.properties || []).forEach(property => {
      if (property.valueType === FieldType.STRING) {
        initialFormValue[property.name] = '';
      } else if (property.valueType === FieldType.INT) {
        initialFormValue[property.name] = '';
      } else if (property.valueType === FieldType.CHOICE) {
        initialFormValue[property.name] = property.enumerations[0].value;
      } else {
        initialFormValue[property.name] = '';
        services.logger.warn('Unsupported valueType: ' + property.valueType);
      }
    });

    return initialFormValue;
  }

  @boundMethod
  private async formSubmitHandler(formValue: LibraryItem) {
    this.props.onCreate(formValue);
    await sleep(0);
    this.setFormValue(this.initialFormValue);
  }

  @boundMethod
  private formChanged(formValue: LibraryItem) {
    this.setFormValue(formValue);
  }

  @boundMethod
  private closeDialog() {
    this.props.onClose();
    this.setFormValue(this.initialFormValue);
  }

  @action
  private setFormValue(formValue: Partial<LibraryItem>) {
    this.formValue = formValue;
  }
}
