import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { Basemap, basemapEditSchema } from '../../../services/data/basemaps/basemaps.models';
import { updateBasemap } from '../../../services/data/basemaps/basemaps.service';
import { getPatch } from '../../../services/util/patch';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';
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

        <FormDialog<Basemap>
          open={this.dialogOpen}
          schema={basemapEditSchema}
          value={basemap}
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
  private async save(value: Basemap) {
    await updateBasemap(this.props.basemap, getPatch(value, this.props.basemap));
    communicationService.basemapUpdated.emit({ type: 'update', data: value });
  }
}
