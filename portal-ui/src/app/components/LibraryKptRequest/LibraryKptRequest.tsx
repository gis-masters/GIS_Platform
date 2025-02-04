import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ForwardToInbox } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { requestKpt } from '../../services/data/kpt/kpt.service';
import { Library } from '../../services/data/library/library.models';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const cnLibraryKptRequest = cn('LibraryKptRequest');

interface LibraryKptRequestProps {
  library: Library;
}

interface KptRequest {
  kptRequest: string;
}

const requestKptSchema: Schema = {
  name: 'requestKpt',
  title: 'requestKpt',
  properties: [
    {
      propertyType: PropertyType.STRING,
      display: 'multiline',
      name: 'kptRequest',
      description:
        'Если необходимо заказать более одного кадастрового квартала - впишите их через запятую без пробелов',
      title: 'Введите номер кадастрового квартала'
    }
  ]
};

@observer
export class LibraryKptRequest extends Component<LibraryKptRequestProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryKptRequestProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title={'Заказ КПТ'}>
          <IconButton className={cnLibraryKptRequest()} onClick={this.openDialog}>
            <ForwardToInbox fontSize='medium' color='inherit' />
          </IconButton>
        </Tooltip>

        <FormDialog<KptRequest>
          className={cnLibraryKptRequest()}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          closeWithConfirm
          title='Заказ КПТ'
          actionFunction={this.save}
          schema={requestKptSchema}
          actionButtonProps={{ startIcon: <ForwardToInbox />, children: 'Заказать' }}
        />
      </>
    );
  }

  @boundMethod
  private async save(request: KptRequest) {
    await requestKpt(request.kptRequest?.split(','));

    communicationService.libraryUpdated.emit({ type: 'update', data: this.props.library });
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
