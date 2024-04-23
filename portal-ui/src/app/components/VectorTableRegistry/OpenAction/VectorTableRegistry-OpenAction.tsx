import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { StickyNote2Outlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../../services/data/schema/schema.models';
import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { FeatureDialog } from '../../FeatureDialog/FeatureDialog';
import { IconButton } from '../../IconButton/IconButton';

const cnVectorTableRegistryOpenAction = cn('VectorTableRegistry', 'OpenAction');

interface VectorTableRegistryOpenActionProps {
  feature: WfsFeature;
  vectorTable: VectorTable;
  schema: Schema;
}

@observer
export class VectorTableRegistryOpenAction extends Component<VectorTableRegistryOpenActionProps> {
  @observable private dialogOpen = false;

  constructor(props: VectorTableRegistryOpenActionProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { feature, vectorTable, schema } = this.props;

    return (
      <>
        <IconButton className={cnVectorTableRegistryOpenAction()} onClick={this.openDialog} size='small'>
          <Tooltip title='Открыть'>
            <StickyNote2Outlined color='primary' />
          </Tooltip>
        </IconButton>

        <FeatureDialog
          schema={schema}
          feature={feature}
          vectorTable={vectorTable}
          open={this.dialogOpen}
          onClose={this.closeDialog}
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
}
