import React, { Component } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../../services/communication.service';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { getDefaultValues } from '../../../Form/Form.utils';
import { cnUtilityDialogContent, UtilityDialogContentProps } from '../UtilityDialog-Content.base';

class UtilityDialogContentTypeFormPrompt extends Component<UtilityDialogContentProps> {
  render() {
    const {
      className,
      formId,
      info: { message, schema, formProps }
    } = this.props;

    return (
      <DialogContent className={className}>
        <DialogContentText>{message}</DialogContentText>
        <RegistryConsumer id='common'>
          {({ Form }: CommonDiRegistry) => (
            <Form
              schema={schema}
              id={formId}
              auto
              actionFunction={this.handleSubmit}
              value={getDefaultValues(schema?.properties || [])}
              {...formProps}
            />
          )}
        </RegistryConsumer>
      </DialogContent>
    );
  }

  @boundMethod
  private handleSubmit(formValue: unknown) {
    const { id } = this.props.info;
    communicationService.utilityDialogClosed.emit({ id, answer: true, formValue });
  }
}

export const withTypeFormPrompt = withBemMod<UtilityDialogContentProps, UtilityDialogContentProps>(
  cnUtilityDialogContent(),
  { type: 'formPrompt' },
  () => UtilityDialogContentTypeFormPrompt
);
