import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { MapOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { Badge, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { getVectorTableConnections } from '../../../services/data/vectorData/vectorData.service';
import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { FeatureInProjects } from '../../FeaturesInProjects/FeaturesInProjects';
import { FileConnection } from '../../../services/data/files/files.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';
import { IconButton } from '../../IconButton/IconButton';

const cnLibrarySearchItemActionsConnections = cn('LibrarySearchItemActions', 'Connections');
const cnLibrarySearchItemActionsConnectionsDialog = cn('LibrarySearchItemActions', 'ConnectionsDialog');

interface LibrarySearchItemActionsConnectionsProps {
  featureId: string;
  vectorTable: VectorTable;
  as: ActionsItemVariant;
}

@observer
export class LibrarySearchItemActionsConnections extends Component<LibrarySearchItemActionsConnectionsProps> {
  @observable private dialogOpen = false;
  @observable private loading = false;
  @observable private connections: FileConnection[] = [];
  private currentVectorTableId = '';

  constructor(props: LibrarySearchItemActionsConnectionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: LibrarySearchItemActionsConnectionsProps) {
    if (this.props.vectorTable.identifier !== prevProps.vectorTable.identifier) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    const { featureId, as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibrarySearchItemActionsConnections()}
          title='Размещено в проектах'
          as={as}
          icon={
            <IconButton size='small'>
              <Badge
                badgeContent={this.connections.length}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                color='default'
              >
                {<MapOutlined fontSize='small' />}
              </Badge>
            </IconButton>
          }
          onClick={this.openDialog}
        />

        <Dialog
          open={this.dialogOpen}
          onClose={this.closeDialog}
          PaperProps={{ className: cnLibrarySearchItemActionsConnectionsDialog() }}
        >
          <DialogTitle>Переход к объекту в проекте:</DialogTitle>
          <DialogContent className='scroll'>
            {this.connections?.length && <FeatureInProjects featureId={featureId} connections={this.connections} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Loading visible={this.loading} global />
      </>
    );
  }

  private async fetchConnections() {
    const { vectorTable } = this.props;
    this.setLoading(true);
    this.currentVectorTableId = vectorTable.identifier;
    const vectorTableConnections = await getVectorTableConnections(vectorTable.identifier);

    if (vectorTableConnections.length && this.currentVectorTableId === vectorTable.identifier) {
      this.setConnections(vectorTableConnections);
    }

    this.setLoading(false);
  }

  @action
  private setConnections(connections: FileConnection[]) {
    this.connections = connections;
  }

  @action
  private dropConnections() {
    this.connections = [];
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
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
