import React, { Component } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../../services/communication.service';
import { type CommonDiRegistry } from '../../../../services/di-registry';
import { getDefaultValues } from '../../../Form/Form.utils';
import { type AnswerModalContentProps, cnAnswerModalContent } from '../AnswerModal-Content.base';

class AnswerModalContentTypeFormPrompt extends Component<AnswerModalContentProps> {
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
    const { id, submitData } = this.props.info;
    communicationService.answerModalClosed.emit({
      id,
      answer: true,
      formValue,
      extra: submitData
    });
  }
}

export const withTypeFormPrompt = withBemMod<AnswerModalContentProps, AnswerModalContentProps>(
  cnAnswerModalContent(),
  { type: 'formPrompt' },
  () => AnswerModalContentTypeFormPrompt
);
