import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { basemapEditSchema, updateBasemap } from '../../../services/data/basemaps.service';
import { communicationService } from '../../../services/communication.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Basemap } from '../../../services/data/basemaps.models';
import { Schema } from '../../../services/data/schema.models';
import { FormDialog } from '../../FormDialog/FormDialog';
import { getPatch } from '../../../services/util/patch';
import { TextBadge } from '../../TextBadge/TextBadge';

const cnBasemapActionsEdit = cn('BasemapActions', 'Edit');

interface BasemapActionsEditProps {
  basemap: Basemap;
  as: ActionsItemVariant;
}

@observer
export class BasemapActionsEdit extends Component<BasemapActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: BasemapActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { basemap, as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnBasemapActionsEdit()}
          title='Редактировать'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Edit /> : <EditOutlined />}
        />

        <FormDialog
          open={this.dialogOpen}
          schema={basemapEditSchema as unknown as Schema}
          value={basemap as unknown as Partial<Basemap>}
          actionFunction={this.save}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title={
            <>
              Редактирование подложки
              <TextBadge id={basemap.id} />
            </>
          }
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async save(value: Basemap | Record<string, unknown>) {
    await updateBasemap(this.props.basemap, getPatch(value, this.props.basemap));
    communicationService.basemapsUpdated.emit();
  }
}
