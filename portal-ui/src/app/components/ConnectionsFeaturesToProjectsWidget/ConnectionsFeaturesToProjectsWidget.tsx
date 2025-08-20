import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from '@mui/material';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { FileConnection } from '../../services/data/files/files.models';
import { SearchItemDataTypeFeature } from '../../services/data/search/search.model';
import { getVectorTableConnections } from '../../services/data/vectorData/vectorData.service';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { Button } from '../Button/Button';
import { FeatureInProjects } from '../FeaturesInProjects/FeaturesInProjects';
import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./ConnectionsFeaturesToProjectsWidget.scss';

const cnConnectionsFeaturesToProjectsWidget = cn('ConnectionsFeaturesToProjectsWidget');

interface ConnectionsFeaturesToProjectsWidgetProps {
  feature: SearchItemDataTypeFeature;
}

@observer
export class ConnectionsFeaturesToProjectsWidget extends Component<ConnectionsFeaturesToProjectsWidgetProps> {
  private currentVectorTableId = '';

  @observable private dialogOpen = false;
  @observable private connections?: FileConnection[] = [];
  @observable private loading = true;

  constructor(props: ConnectionsFeaturesToProjectsWidgetProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: ConnectionsFeaturesToProjectsWidgetProps) {
    if (this.props.feature.source.table !== prevProps.feature.source.table) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    const count = this.connections?.length || 0;
    const textProjects = `${count} ${pluralize(count, 'проект', 'проекта', 'проектов')}`;

    return (
      <>
        <div className={cnConnectionsFeaturesToProjectsWidget()}>
          {this.loading ? (
            <Skeleton height={24} animation='wave' width='190px' />
          ) : (
            <>
              Объект подключен в{' '}
              {count ? <PseudoLink onClick={this.openDialog}>{textProjects}</PseudoLink> : textProjects}
              <Dialog
                open={this.dialogOpen}
                onClose={this.closeDialog}
                PaperProps={{ className: cnConnectionsFeaturesToProjectsWidget('Dialog') }}
                maxWidth='sm'
                fullWidth
              >
                <DialogTitle>Переход к объекту в проекте:</DialogTitle>
                <DialogContent className='scroll'>
                  {this.connections?.length && (
                    <FeatureInProjects
                      featureId={String(extractFeatureId(this.props.feature.payload.id))}
                      connections={this.connections}
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeDialog}>Закрыть</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
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

  private async fetchConnections() {
    const { feature } = this.props;
    this.setLoading(true);
    this.currentVectorTableId = feature.source.table;
    const vectorTableConnections = await getVectorTableConnections(feature.source.table);
    if (vectorTableConnections.length && this.currentVectorTableId === feature.source.table) {
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
}
