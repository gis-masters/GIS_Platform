import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, observable } from 'mobx';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { Form } from '../../Form/Form';
import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';
import { services } from '../../../services/services';
import { FeatureDescription, FieldType } from '../../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./CreateLibraryElement-Dialog.scss';

const cnAddDocumentDialog = cn('Explorer-CreateElementDialog');

export interface ExplorerCreateElementDialogProps {
  schema?: FeatureDescription;
  open: boolean;
  onClose: () => void;
  onCreate: (formValue: { [key: string]: unknown }) => void;
}

@observer
export class CreateLibraryElementDialog extends React.Component<ExplorerCreateElementDialogProps> {
  @observable private formValue: { [key: string]: unknown };
  @observable private loading = false;

  componentDidUpdate() {
    this.setLoading(false);
  }

  render() {
    const { open, schema } = this.props;

    return (
      <>
        {schema && (
          <Dialog
            className={cnAddDocumentDialog()}
            disableEscapeKeyDown={true}
            disableBackdropClick={true}
            maxWidth={'md'}
            open={open}
            onClose={this.closeDialog}
          >
            <DialogTitle>Созание нового элемента</DialogTitle>

            <DialogContent className={cnAddDocumentDialog('Content')}>
              <Form
                id='addDocumentForm'
                schema={schema}
                formValue={this.initialFormValue}
                onFormChange={this.formChanged}
                onFormSubmit={this.formSubmitHandler}
              />
              <Loading visible={this.loading} />
            </DialogContent>

            <DialogActions>
              <Button form='addDocumentForm' type='submit' color='primary' disabled={false}>
                Создать
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @computed
  private get initialFormValue(): {} {
    if (this.formValue) {
      return this.formValue;
    } else {
      const initialFormValue = {};
      this.props.schema.properties.forEach(property => {
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
  }

  @boundMethod
  private async formSubmitHandler(formValue: { [key: string]: unknown }) {
    this.setLoading(true);
    this.props.onCreate(formValue);
  }

  @boundMethod
  private formChanged(formValue: { [key: string]: unknown }) {
    this.setFormValue(formValue);
  }

  @action.bound
  private closeDialog() {
    this.props.onClose();
    this.setFormValue({});
  }

  @action
  private setLoading(value: boolean) {
    this.loading = value;
  }

  @action
  private setFormValue(formValue: { [key: string]: unknown }) {
    this.formValue = formValue;
  }
}
