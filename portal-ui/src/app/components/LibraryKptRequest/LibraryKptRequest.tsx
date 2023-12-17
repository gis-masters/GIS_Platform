import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { ForwardToInbox } from '@mui/icons-material';
import { action, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import moment from 'moment';

import { createLibraryRecord } from '../../services/data/library/library.service';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { requestKpt } from '../../services/data/kpt/kpt.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const cnLibraryKptRequest = cn('LibraryKptRequest');

interface LibraryKptRequestProps {
  path?: number[];
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

        <FormDialog
          className={cnLibraryKptRequest()}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          title='Заказ КПТ'
          actionFunction={this.save}
          schema={requestKptSchema}
          actionButtonProps={{ startIcon: <ForwardToInbox />, children: 'Заказать' }}
        />
      </>
    );
  }

  @boundMethod
  private async save() {
    const requestInfo = await requestKpt();
    const path = this.props.path ? `/root/${this.props.path.join('/')}` : '/root';

    const requestKptData = {
      order_number: requestInfo.clientId,
      title: `Заказ № ${requestInfo.clientId}`,
      performer: `${currentUser.name} ${currentUser.surname}`,
      status: 'Заказано',
      date_order: moment().format('YYYY-MM-DD'),
      content_type_id: 'folder_v1',
      path
    };

    await createLibraryRecord(requestKptData, 'dl_data_kpt', 'dl_data_kpt');
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
